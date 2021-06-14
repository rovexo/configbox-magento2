/**
 * @module configbox/rfq
 */
define(['cbj', 'configbox/customerform', 'configbox/server'], function(cbj, customerForm, server) {

    "use strict";

    /**
     * @exports configbox/rfq
     */
    var module = {

        initRfqPage: function() {

            cbj(document).on('click', '.view-rfq .trigger-request-quotation', module.onQuoteRequested);

        },

        onQuoteRequested: function() {

            var button = cbj(this);

            // Deal with multiple clicks
            if (button.hasClass('processing')) {
                return;
            }

            // Add the spinner to the button
            button.addClass('processing');

            // Get the form data
            var requestData = customerForm.getCustomerFormData();

            requestData.cartId = button.closest('.view-rfq').data('cart-id');
            requestData.comment = button.closest('.view-rfq').find('#comment').val();

            server.makeRequest('rfq', 'processQuotationRequest', requestData)

                .always(function() {
                    button.removeClass('processing');
                })

                .done(function(response) {

                    if (response.success === false) {

                        if (typeof(response.validationIssues) != 'undefined' && response.validationIssues.length) {
                            customerForm.displayValidationIssues(response.validationIssues);
                            return;
                        }
                        else {
                            window.alert(response.errors.join("\n"));
                            return;
                        }

                    }

                    // Remove any validation issues
                    customerForm.removeValidationIssues();

                    if (response.redirectUrl) {
                        window.location.href = response.redirectUrl;
                    }

                });

        }

    };

    return module;

});
