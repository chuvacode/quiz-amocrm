<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @since      1.0.0
 *
 * @package    Quiz_Amocrm
 * @subpackage Quiz_Amocrm/admin/partials
 */

?>

<div class="wrap">

  <form method="post" name="my_options" action="options.php">

      <?php

      // Getting the plugin settings
      $options = get_option($this->plugin_name);

      // Setting the current values
      $CLIENT_ID = $options['CLIENT_ID'];
      $CLIENT_SECRET = $options['CLIENT_SECRET'];
      $CLIENT_REDIRECT_URI = $options['CLIENT_REDIRECT_URI'];

      $ACCESS_TOKEN = $options['ACCESS_TOKEN'];
      $REFRESH_TOKEN = $options['REFRESH_TOKEN'];
      $EXPIRES = $options['EXPIRES'];
      $BASE_DOMAIN = $options['BASE_DOMAIN'];

      // Display hidden form fields on the setting page
      settings_fields($this->plugin_name);
      do_settings_sections($this->plugin_name);

      ?>

    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <table class="form-table" role="presentation">
      <tbody>
      <tr>
        <th>
          <label for="<?php echo $this->plugin_name; ?>-CLIENT_ID">
              <?php esc_attr_e('CLIENT ID', $this->plugin_name); ?>
          </label>
        </th>
        <td>
          <input type="text"
                 name="<?php echo $this->plugin_name; ?>[CLIENT_ID]"
                 id="<?php echo $this->plugin_name; ?>-CLIENT_ID"
                 class="regular-text code"
                 value="<?php if (!empty($CLIENT_ID)) esc_attr_e($CLIENT_ID, $this->plugin_name); ?>"
          >
        </td>
      </tr>

      <tr>
        <th>
          <label for="<?php echo $this->plugin_name; ?>-CLIENT_SECRET">
              <?php esc_attr_e('CLIENT SECRET', $this->plugin_name); ?>
          </label>
        </th>
        <td>
          <input type="text"
                 name="<?php echo $this->plugin_name; ?>[CLIENT_SECRET]"
                 id="<?php echo $this->plugin_name; ?>-CLIENT_SECRET"
                 class="regular-text code"
                 value="<?php if (!empty($CLIENT_SECRET)) esc_attr_e($CLIENT_SECRET, $this->plugin_name); ?>"
          >
        </td>
      </tr>

      <tr>
        <th>
          <label for="<?php echo $this->plugin_name; ?>-CLIENT_REDIRECT_URI">
              <?php esc_attr_e('CLIENT REDIRECT URI', $this->plugin_name); ?>
          </label>
        </th>
        <td>
          <input type="text"
                 name="<?php echo $this->plugin_name; ?>[CLIENT_REDIRECT_URI]"
                 id="<?php echo $this->plugin_name; ?>-CLIENT_REDIRECT_URI"
                 class="regular-text code"
                 value="<?php if (!empty($CLIENT_REDIRECT_URI)) esc_attr_e($CLIENT_REDIRECT_URI, $this->plugin_name); ?>"
          >
        </td>
      </tr>

      <tr>
        <th>
          <label for="<?php echo $this->plugin_name; ?>-ACCESS_TOKEN">
              <?php esc_attr_e('ACCESS_TOKEN', $this->plugin_name); ?>
          </label>
        </th>
        <td>
          <input type="text"
                 name="<?php echo $this->plugin_name; ?>[ACCESS_TOKEN]"
                 id="<?php echo $this->plugin_name; ?>-ACCESS_TOKEN"
                 class="regular-text code"
                 value="<?php if (!empty($ACCESS_TOKEN)) esc_attr_e($ACCESS_TOKEN, $this->plugin_name); ?>"
                 disabled
          >
        </td>
      </tr>
      <tr>
        <th>
          <label for="<?php echo $this->plugin_name; ?>-REFRESH_TOKEN">
              <?php esc_attr_e('REFRESH_TOKEN', $this->plugin_name); ?>
          </label>
        </th>
        <td>
          <input type="text"
                 name="<?php echo $this->plugin_name; ?>[REFRESH_TOKEN]"
                 id="<?php echo $this->plugin_name; ?>-REFRESH_TOKEN"
                 class="regular-text code"
                 value="<?php if (!empty($REFRESH_TOKEN)) esc_attr_e($REFRESH_TOKEN, $this->plugin_name); ?>"
                 disabled
          >
        </td>
      </tr>
      <tr>
        <th>
          <label for="<?php echo $this->plugin_name; ?>-EXPIRES">
              <?php esc_attr_e('EXPIRES', $this->plugin_name); ?>
          </label>
        </th>
        <td>
          <input type="text"
                 name="<?php echo $this->plugin_name; ?>[EXPIRES]"
                 id="<?php echo $this->plugin_name; ?>-EXPIRES"
                 class="regular-text code"
                 value="<?php if (!empty($EXPIRES)) esc_attr_e($EXPIRES, $this->plugin_name); ?>"
                 disabled
          >
        </td>
      </tr>
      <tr>
        <th>
          <label for="<?php echo $this->plugin_name; ?>-BASE_DOMAIN">
              <?php esc_attr_e('BASE_DOMAIN', $this->plugin_name); ?>
          </label>
        </th>
        <td>
          <input type="text"
                 name="<?php echo $this->plugin_name; ?>[BASE_DOMAIN]"
                 id="<?php echo $this->plugin_name; ?>-BASE_DOMAIN"
                 class="regular-text code"
                 value="<?php if (!empty($BASE_DOMAIN)) esc_attr_e($BASE_DOMAIN, $this->plugin_name); ?>"
                 disabled
          >
        </td>
      </tr>

      </tbody>
    </table>

      <?php submit_button("Сохранить изменения", 'primary', 'submit', TRUE); ?>

      <? if (!empty($CLIENT_REDIRECT_URI) && !empty($CLIENT_SECRET) && !empty($CLIENT_ID)) {

          $apiClient = new \AmoCRM\Client\AmoCRMApiClient($CLIENT_ID, $CLIENT_SECRET, $CLIENT_REDIRECT_URI);

          $authorizationUrl = $apiClient->getOAuthClient()->getAuthorizeUrl([
              'state' => $CLIENT_ID,
              'mode' => 'post_message',
          ]);

          echo "<input type=\"button\" name=\"access\" id=\"submit\" class=\"button button-primary\" value=\"Получить\Обновить Access Token\" onclick=\"window.open('" . $authorizationUrl . "')\">";

      } ?>

  </form>

</div>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->
