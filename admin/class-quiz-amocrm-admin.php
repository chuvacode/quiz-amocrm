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
class Quiz_Amocrm_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $quiz_amocrm    The ID of this plugin.
	 */
	private $quiz_amocrm;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $quiz_amocrm       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $quiz_amocrm, $version ) {

		$this->quiz_amocrm = $quiz_amocrm;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

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

		wp_enqueue_style( $this->quiz_amocrm, plugin_dir_url( __FILE__ ) . 'css/quiz-amocrm-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

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

		wp_enqueue_script( $this->quiz_amocrm, plugin_dir_url( __FILE__ ) . 'js/quiz-amocrm-admin.js', array( 'jquery' ), $this->version, false );

	}

}
