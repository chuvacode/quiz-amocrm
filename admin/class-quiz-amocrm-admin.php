<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @since      1.0.0
 *
 * @package    Quiz_Amocrm
 * @subpackage Quiz_Amocrm/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Quiz_Amocrm
 * @subpackage Quiz_Amocrm/admin
 * @author     Alexey Chuvakov
 */
class Quiz_Amocrm_Admin
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
     * Initialize the class and set its properties.
     *
     * @param string $plugin_name The name of this plugin.
     * @param string $version The version of this plugin.
     * @since    1.0.0
     */
    public function __construct($plugin_name, $version)
    {

        $this->plugin_name = $plugin_name;
        $this->version = $version;

    }

    /**
     * Register the stylesheets for the admin area.
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

        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/quiz-amocrm-admin.css', array(), $this->version, 'all');

    }

    /**
     * Register the JavaScript for the admin area.
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

        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/quiz-amocrm-admin.js', array('jquery'), $this->version, false);

    }

    /**
     * Register the administration menu for this plugin into the WordPress Dashboard menu.
     */

    public function add_plugin_admin_menu()
    {

        /*
         * Add a settings page for this plugin to the Settings menu.
        */

        add_options_page(__('Settings Quiz AmoCRM', $this->plugin_name), __('Quiz AmoCRM', $this->plugin_name), 'manage_options', $this->plugin_name, array($this, 'display_plugin_setup_page'));

    }

    /**
     * Add settings action link to the plugins page.
     * @param $links
     * @return array
     */
    public function add_action_links($links)
    {

        $settings_link = array(
            '<a href="' . admin_url('options-general.php?page=' . $this->plugin_name) . '">' . __('Settings', $this->plugin_name) . '</a>',
        );
        return array_merge($settings_link, $links);

    }

    /**
     * Render the settings page for this plugin.
     */

    public function display_plugin_setup_page()
    {

        include_once(plugin_dir_path(dirname(__FILE__)) . "admin/partials/quiz-amocrm-admin-display.php");

    }

    /**
     * Validate options
     */
    public function validate($input)
    {

        $valid = array();

        $valid['CLIENT_ID'] = (isset($input['CLIENT_ID']) && !empty($input['CLIENT_ID'])) ? $input['CLIENT_ID'] : '';
        $valid['CLIENT_SECRET'] = (isset($input['CLIENT_SECRET']) && !empty($input['CLIENT_SECRET'])) ? $input['CLIENT_SECRET'] : '';
        $valid['CLIENT_REDIRECT_URI'] = (isset($input['CLIENT_REDIRECT_URI']) && !empty($input['CLIENT_REDIRECT_URI'])) ? $input['CLIENT_REDIRECT_URI'] : '';

        if ($valid['CLIENT_ID'] != '' && $valid['CLIENT_SECRET'] != '' && $valid['CLIENT_REDIRECT_URI'] != '') {
        }

        return $valid;

    }


    /**
     * Update all options
     */
    public function options_update()
    {

        register_setting($this->plugin_name, $this->plugin_name, array($this, 'validate'));

    }

}
