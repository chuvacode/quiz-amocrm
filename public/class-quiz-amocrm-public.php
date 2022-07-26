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
     * Initialize the class and set its properties.
     *
     * @param string $plugin_name The name of the plugin.
     * @param string $version The version of this plugin.
     * @since    1.0.0
     */
    public function __construct($plugin_name, $version)
    {

        $this->plugin_name = $plugin_name;
        $this->version = $version;
        $this->plugin_options = get_option($this->plugin_name);

        $clientId = isset($this->plugin_options['CLIENT_ID']) ? $this->plugin_options['CLIENT_ID'] : "";
        $clientSecret = isset($this->plugin_options['CLIENT_SECRET']) ? $this->plugin_options['CLIENT_SECRET'] : "";
        $redirectUri = isset($this->plugin_options['CLIENT_REDIRECT_URI']) ? $this->plugin_options['CLIENT_REDIRECT_URI'] : "";

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

        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/quiz-amocrm-public.js', array('jquery'), $this->version, false);

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
}
