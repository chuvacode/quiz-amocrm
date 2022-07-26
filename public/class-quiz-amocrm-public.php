<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @since      1.0.0
 *
 * @package    Quiz_Amocrm
 * @subpackage Quiz_Amocrm/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Quiz_Amocrm
 * @subpackage Quiz_Amocrm/public
 * @author     Alexey Chuvakov
 */
class Quiz_Amocrm_Public
{

    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $plugin_name The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $version The current version of this plugin.
     */
    private $version;

    /**
     * The plugin options
     *
     * @since    1.0.0
     * @access   private
     * @var array $plugin_options The plugin options
     */
    private $plugin_options;

    /**
     * The options for working on the local server
     *
     * @since    1.0.0
     * @access   private
     * @var boolean $locale_mode
     */
    private $locale_mode;

    /**
     * Initialize the class and set its properties.
     *
     * @param string $plugin_name The name of the plugin.
     * @param string $version The version of this plugin.
     * @since    1.0.0
     */
    public function __construct($plugin_name, $version)
    {

        $this->locale_mode = false;
        $this->plugin_name = $plugin_name;
        $this->version = $version;
        $this->plugin_options = get_option($this->plugin_name);

        $clientId = isset($this->plugin_options['CLIENT_ID']) ? $this->plugin_options['CLIENT_ID'] : "";
        $clientSecret = isset($this->plugin_options['CLIENT_SECRET']) ? $this->plugin_options['CLIENT_SECRET'] : "";
        $redirectUri = isset($this->plugin_options['CLIENT_REDIRECT_URI']) ? $this->plugin_options['CLIENT_REDIRECT_URI'] : "";

        if ($this->locale_mode) return;

        try {
            if ($clientId != "" && $clientSecret != "" && $redirectUri != "") {
                $this->apiClient = new \AmoCRM\Client\AmoCRMApiClient($clientId, $clientSecret, $redirectUri);
            }
        } catch (\Throwable $e) {
            wp_die($e);
        }



        $this->access_token = $this->getAccessToken();

        // Checking the token's operability
        try {
            $this->apiClient
                ->setAccessToken($this->access_token)
                ->setAccountBaseDomain($this->access_token->getValues()['baseDomain']);
            $ownerDetails = $this->apiClient->getOAuthClient()->getResourceOwner($this->access_token);
        } catch (\Throwable $e) {
            // Update Token
            try {
                $OAuthClient = $this->apiClient->getOAuthClient();
                $accessToken = $OAuthClient->getOAuthProvider()->getAccessToken(new RefreshToken(), [
                    'refresh_token' => $this->access_token->getRefreshToken(),
                ]);

                // Сохраняем токен
                $this->saveToken(
                    [
                        'accessToken' => $accessToken->getToken(),
                        'refreshToken' => $accessToken->getRefreshToken(),
                        'expires' => $accessToken->getExpires(),
                        'baseDomain' => $this->access_token->getValues()['baseDomain']
                    ]
                );

            } catch (\Throwable $e) {
                /*var_dump("Проблемы при обновлении токена AMOCRM");
                var_dump($e);*/
            }
        }
    }

    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueue_styles()
    {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Quiz_Amocrm_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Quiz_Amocrm_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/quiz-amocrm-public.css', array(), $this->version, 'all');

    }

    /**
     * Register the JavaScript for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueue_scripts()
    {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Quiz_Amocrm_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Quiz_Amocrm_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        wp_enqueue_script($this->plugin_name . "_input-mask", 'https://cdn.jsdelivr.net/npm/jquery.maskedinput@1.4.1/src/jquery.maskedinput.min.js', array('jquery'), $this->version, false);
        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/quiz-amocrm-public.js', array('jquery', $this->plugin_name . "_input-mask"), $this->version, false);
        wp_localize_script($this->plugin_name, 'wp_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            '_nonce' => wp_create_nonce('send_form_quiz_amacrm'),
        ));
    }

    /**
     * Authorization of AmoCRM services
     */
    public function auth()
    {

        $page_slug = 'quiz-save-answer';
        $uri = $_SERVER['REQUEST_URI'];
        $path = wp_parse_url($uri, PHP_URL_PATH);

        if ('/' . trailingslashit($page_slug) === trailingslashit($path)) {
            $clientId = $this->plugin_options['CLIENT_ID'];
            $clientSecret = $this->plugin_options['CLIENT_SECRET'];
            $redirectUri = $this->plugin_options['CLIENT_REDIRECT_URI'];

            $apiClient = new \AmoCRM\Client\AmoCRMApiClient($clientId, $clientSecret, $redirectUri);

            // Catching the reverse code
            try {
                if (empty($_GET['code'])) {
                    die("Empty \$_GET['code']");
                }
                if (empty($_GET['referer'])) {
                    die("Empty \$_GET['referer']");
                }

                $apiClient->setAccountBaseDomain($_GET['referer']);

                var_dump($apiClient->getOAuthClient());

                $accessToken = $apiClient->getOAuthClient()->getAccessTokenByCode($_GET['code']);

                if (!$accessToken->hasExpired()) {
                    $this->plugin_options['ACCESS_TOKEN'] = $accessToken->getToken();
                    $this->plugin_options['REFRESH_TOKEN'] = $accessToken->getRefreshToken();
                    $this->plugin_options['EXPIRES'] = $accessToken->getExpires();
                    $this->plugin_options['BASE_DOMAIN'] = $apiClient->getAccountBaseDomain();
                    update_option($this->plugin_name, $this->plugin_options);
                    wp_redirect(home_url() . "/wp-admin/options-general.php?page=quiz-amocrm");
                }

                die("Invalid auth");

            } catch (Exception $e) {
                die((string)$e);
            }
            exit;
        }

    }

    /**
     * Getting a new access token
     */
    public function getAccessToken()
    {
        if (
            !empty($this->plugin_options['ACCESS_TOKEN'])
            && !empty($this->plugin_options['REFRESH_TOKEN'])
            && !empty($this->plugin_options['EXPIRES'])
            && !empty($this->plugin_options['BASE_DOMAIN'])
        ) {
            return new \League\OAuth2\Client\Token\AccessToken([
                'access_token' => $this->plugin_options['ACCESS_TOKEN'],
                'refresh_token' => $this->plugin_options['REFRESH_TOKEN'],
                'expires' => $this->plugin_options['EXPIRES'],
                'baseDomain' => $this->plugin_options['BASE_DOMAIN'],
            ]);
        } else {
            return null;
        }
    }

    /**
     * Save a new access token
     */
    function saveToken($accessToken)
    {
        if (
            isset($accessToken)
            && isset($accessToken['accessToken'])
            && isset($accessToken['refreshToken'])
            && isset($accessToken['expires'])
            && isset($accessToken['baseDomain'])
        ) {
            $this->plugin_options['ACCESS_TOKEN'] = $accessToken['accessToken'];
            $this->plugin_options['REFRESH_TOKEN'] = $accessToken['refreshToken'];
            $this->plugin_options['EXPIRES'] = $accessToken['expires'];
            $this->plugin_options['BASE_DOMAIN'] = $accessToken['baseDomain'];
            update_option($this->plugin_name, $this->plugin_options);
        } else {
            exit('Invalid access token ' . var_export($accessToken, true));
        }
    }

    /**
     * Handler quiz form
     */
    function handler_quiz_form()
    {

        if ($this->locale_mode) {
            wp_send_json_success();
            wp_die();
        }

        if (!(isset($this->access_token) && isset($this->apiClient))) {
            wp_send_json_error();
            wp_die();
        }

        // Getting Access Token
        $this->apiClient->setAccessToken($this->access_token)
            ->setAccountBaseDomain($this->access_token->getValues()['baseDomain'])
            ->onAccessTokenRefresh(
                function (AccessTokenInterface $accessToken, $baseDomain) {
                    $this->saveToken(
                        [
                            'accessToken' => $accessToken->getToken(),
                            'refreshToken' => $accessToken->getRefreshToken(),
                            'expires' => $accessToken->getExpires(),
                            'baseDomain' => $baseDomain,
                        ]
                    );
                }
            );

        // Create contact
        $contact = new ContactModel();
        $contact->setName($_POST["firstname"]);
        $customFields = new CustomFieldsValuesCollection();
        $phoneField = (new MultitextCustomFieldValuesModel())->setFieldCode('PHONE');
        $customFields->add($phoneField);

        // Set a mobile number
        $phoneField->setValues(
            (new MultitextCustomFieldValueCollection())
                ->add(
                    (new MultitextCustomFieldValueModel())
                        ->setEnum('WORKDD')
                        ->setValue($_POST["phone"])
                )
        );
        $contact->setCustomFieldsValues($customFields);

        // Push contact
        try {
            $contactModel = $this->apiClient->contacts()->addOne($contact);
        } catch (AmoCRMApiException $e) {
            print_r($e);
            wp_die();
        }

        // Getting leads controller
        $leadsService = $this->apiClient->leads();

        // Create lead
        $lead = new LeadModel();
        $lead->setName('Форма на сайте');
        $lead->setContacts(
            (new ContactsCollection())
                ->add($contactModel)
        );

        // Push lead
        try {
            $lead = $leadsService->addOne($lead);
        } catch (AmoCRMApiException $e) {
            wp_send_json_error("Ошибка при создании лида");
            wp_die();
        }

        // Create message
        $text_sms = "";
        $text_sms .= "Имя: " . $_POST['firstname'] . " \n\n";
        $text_sms .= "Телефон: " . $_POST['phone'] . " \n\n";

        foreach ($_POST["quiz"] as $item) {
            $text_sms .= $item["title"] . "\n";
            foreach ($item["value"] as $value) {
                $text_sms .= $value . "\n";
            }
            $text_sms .= "\n";
        }

        // Create NotesCollection
        $notesCollection = new NotesCollection();

        // Create Note
        $commonNote = new CommonNote();
        $commonNote->setEntityId($lead->getId())
            ->setText($text_sms);
        $notesCollection->add($commonNote);

        // Push NotesCollection
        try {
            $leadNotesService = $this->apiClient->notes(EntityTypesInterface::LEADS);
            $notesCollection = $leadNotesService->add($notesCollection);
        } catch (AmoCRMApiException $e) {
            // print_r($e);
            wp_send_json_error("Ошибка при добавлении записки к лиду");
            wp_die();
        }

        // Everything success
        wp_send_json_success();
        wp_die();

    }

    /**
     * Handler feedback form
     */
    function handler_form_feedback()
    {

        if ($this->locale_mode) {
            wp_send_json_success();
            wp_die();
        }

        $_POST["firstname"] = $_POST["us_form_1_text_1"];
        $_POST["phone"] = $_POST["us_form_1_text_2"];

        if (!(isset($this->access_token) && isset($this->apiClient))) {
            wp_send_json_error();
            wp_die();
        }

        if ($_POST["firstname"] == "" or $_POST["phone"] == "" or $_POST["handler-amocrm"] != "true") {
            wp_send_json_error();
            wp_die();
        }

        // Getting Access Token
        $this->apiClient->setAccessToken($this->access_token)
            ->setAccountBaseDomain($this->access_token->getValues()['baseDomain'])
            ->onAccessTokenRefresh(
                function (AccessTokenInterface $accessToken, $baseDomain) {
                    $this->saveToken(
                        [
                            'accessToken' => $accessToken->getToken(),
                            'refreshToken' => $accessToken->getRefreshToken(),
                            'expires' => $accessToken->getExpires(),
                            'baseDomain' => $baseDomain,
                        ]
                    );
                }
            );

        // Create contact
        $contact = new ContactModel();
        $contact->setName($_POST["firstname"]);
        $customFields = new CustomFieldsValuesCollection();
        $phoneField = (new MultitextCustomFieldValuesModel())->setFieldCode('PHONE');
        $customFields->add($phoneField);

        // Set a mobile number
        $phoneField->setValues(
            (new MultitextCustomFieldValueCollection())
                ->add(
                    (new MultitextCustomFieldValueModel())
                        ->setEnum('WORKDD')
                        ->setValue($_POST["phone"])
                )
        );
        $contact->setCustomFieldsValues($customFields);

        // Push contact
        try {
            $contactModel = $this->apiClient->contacts()->addOne($contact);
        } catch (AmoCRMApiException $e) {
            print_r($e);
//            wp_send_json_error("Ошибка при сохранении контакта");
            wp_die();
        }

        // Getting leads controller
        $leadsService = $this->apiClient->leads();

        // Create lead
        $lead = new LeadModel();
        $lead->setName('Заказать обратный звонок');
        $lead->setContacts(
            (new ContactsCollection())
                ->add($contactModel)
        );

        // Push lead
        try {
            $lead = $leadsService->addOne($lead);
        } catch (AmoCRMApiException $e) {
//            print_r($e);
            wp_send_json_error("Ошибка при создании лида");
            wp_die();
        }

        // Create message
        $text_sms = "";
        $text_sms .= "Имя: " . $_POST['firstname'] . " \n\n";
        $text_sms .= "Телефон: " . $_POST['phone'] . " \n\n";

        // Create NotesCollection
        $notesCollection = new NotesCollection();

        // Create Note
        $commonNote = new CommonNote();
        $commonNote->setEntityId($lead->getId())
            ->setText($text_sms);
        $notesCollection->add($commonNote);

        // Push NotesCollection
        try {
            $leadNotesService = $this->apiClient->notes(EntityTypesInterface::LEADS);
            $notesCollection = $leadNotesService->add($notesCollection);
        } catch (AmoCRMApiException $e) {
            // print_r($e);
            wp_send_json_error("Ошибка при добавлении записки к лиду");
            wp_die();
        }

        // Everything success
        wp_send_json_success();
        wp_die();

    }

    /**
     * [v1] Display Popup Form
     */
    function render_popup_form_v1()
    {
        ob_start();
        require(plugin_dir_path(__FILE__) . 'partials/form-1/quiz-amocrm-popup-form-display.php');
        $html = ob_get_contents();
        $html = do_shortcode($html);
        ob_end_clean();

        return $html;
    }

    /**
     * [v1] Display In Page Form
     */
    function render_inpage_form_v1()
    {
        ob_start();
        require(plugin_dir_path(__FILE__) . 'partials/form-1/quiz-amocrm-form-inpage-display.php');
        $html = ob_get_contents();
        $html = do_shortcode($html);
        ob_end_clean();

        return $html;
    }

    /**
     * [v2] Display Popup Form
     */
    function render_popup_form_v2()
    {
        ob_start();
        require(plugin_dir_path(__FILE__) . 'partials/form-2/quiz-amocrm-popup-form-display.php');
        $html = ob_get_contents();
        $html = do_shortcode($html);
        ob_end_clean();

        return $html;
    }

    /**
     * [v2] Display In Page Form
     */
    function render_inpage_form_v2()
    {
        ob_start();
        require(plugin_dir_path(__FILE__) . 'partials/form-2/quiz-amocrm-form-inpage-display');
        $html = ob_get_contents();
        $html = do_shortcode($html);
        ob_end_clean();

        return $html;
    }

    /**
     * [v3] Display Popup Form
     */
    function render_popup_form_v3()
    {
        ob_start();
        require(plugin_dir_path(__FILE__) . 'partials/form-3/quiz-amocrm-popup-form-display.php');
        $html = ob_get_contents();
        $html = do_shortcode($html);
        ob_end_clean();

        return $html;
    }

    /**
     * [v3] Display In Page Form
     */
    function render_inpage_form_v3()
    {
        ob_start();
        require(plugin_dir_path(__FILE__) . 'partials/form-3/quiz-amocrm-form-inpage-display.php');
        $html = ob_get_contents();
        $html = do_shortcode($html);
        ob_end_clean();

        return $html;
    }
}
