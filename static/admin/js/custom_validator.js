$(document).ready(function(){
        $.validator.addMethod("accept", function (value, element)
        {
            return this.optional(element) || /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-,.!_@ ])*$/.test(value);
        }, "Letters and spaces only please");
        $.validator.addMethod("email", function (value, element)
        {
            return this.optional(element) || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
        }, "Letters and spaces only please");

        $.validator.addMethod('ccexp', function(value, element, params) {
          var minMonth = new Date().getMonth() + 1;
          var minYear = new Date().getFullYear();
          var month = parseInt($(params.month).val(), 10);
          var year = parseInt($(params.year).val(), 10);
        //   try {
        //     $('#card_expiry_yr, #card_expiry_month').valid();   
        //   } catch (error) {
        //       console.log(error)
        //   }
          return (!month || !year || year > minYear || (year === minYear && month >= minMonth));
        }, 'Your Credit Card Expiration date is invalid.');
        $.validator.addMethod("greaterThan",
        function(value, element, params) {

            if (!/Invalid|NaN/.test(new Date(value))) {
                return new Date(value) > new Date($(params).val());
            }

            return isNaN(value) && isNaN($(params).val()) ||
                (Number(value) > Number($(params).val()));
        }, 'Please enter a valid value');

        $.validator.addMethod("timeDifferenceValid", function(value, element, params) {
            const otherVal = $(params).val();
            // Allow empty values to pass (optional, based on your form requirements)
            if (!value || !otherVal) {
                return true;
            }

            const start = new Date(otherVal);
            const end = new Date(value);
            // Ensure both are valid dates
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return false;
            }

            const diffMs = end - start;
            const diffMinutes = diffMs / (1000 * 60);

            return diffMinutes >= 30 && diffMinutes <= 120;
        }, 'Time difference must be between 30 minutes and 2 hours.');

        $.validator.addMethod("greaterThanValue",
        function (value, element, param) {

              var $otherElement = $(param);
              if($otherElement.val()){
                var otherElement = $otherElement.val().replace('$','').replace(/,/g, '');
              }
              if(value){
                value = value.replace('$','').replace(/,/g, '');
              }

              if(typeof($otherElement.val()) !='undefined' && $otherElement != ""){
                return (parseFloat(value, 10) > parseFloat(otherElement, 10));
              }else{
                return true;
              }

        }, 'Must be greater than {0}.');

        $.validator.addMethod("yearcheck",
        function (value, element, param) {
            return  Number(value) >= new Date().getFullYear()
        }, 'Invalid Year.');
        $.validator.addMethod("thousandsepratornum", function (value, element)
        {
            if(value){
                value = value.replace('$','').replace(/,/g, '');
            }
            return this.optional(element) || /^[0-9]+(,[0-9]+)*$/.test(value) || /^(?!0|\.00)[0-9]+(,\d{3})*(.?[0-9]{1,2})$/.test(value);
        }, "Please enter valid amount");
        $.validator.addMethod("decimalvalidator", function (value, element)
        {
            return this.optional(element) || /^\d+(.?[0-9]{1,2})?$/.test(value);
        }, "Please enter valid number");
        $.validator.addMethod("edvalidator", function (value, element)
        {
            if(value){
                value = value.replace('$','').replace(/,/g, '');
            }
            if(parseInt($('input[name="earnest_deposit_type"]:checked').val()) == 1){
                return this.optional(element) || /^[0-9]+(,[0-9]+)*$/.test(value) || /^(?!0|\.00)[0-9]+(,\d{3})*(.?[0-9]{1,2})$/.test(value);
            }else{
                return this.optional(element) || /^\d+(.?[0-9]{1,2})?$/.test(value);
            }

        }, "Please enter valid number");
        $.validator.addMethod("lessThan",
        function (value, element, param) {
            if(value){
                value = value.replace('$','').replace(/,/g, '');
            }
              var $otherElement = $(param);

              if(typeof($otherElement.val()) !='undefined' && $otherElement != ""){
                return this.optional(element) || (parseFloat(value, 10) <= parseFloat($otherElement.val().replace('$','').replace(/,/g, ''), 10));
              }else{
                return true;
              }

        }, 'Must be greater than {0}.');
        $.validator.addMethod("minvalue", function (value, element, param)
        {

            if(value){
                value = value.replace('$','').replace(/,/g, '');
            }
            return this.optional(element) || (parseFloat(value, 10) >= parseFloat(param));
        }, "Must Be greater than or equal {0}");

        $.validator.addMethod("uppercasepass",
            function(value, element, param) {
                if (!/[A-Z]/.test(value)) {
                    return false;
                }
                return true
        },"Include at least 1 uppercase letter.");


        $.validator.addMethod("validate_email", function(value, element) {

            if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)) {
                return true;
            } else {
                return false;
            }
        }, "Please enter a valid Email.");

        $.validator.addMethod("acceptcharacters", function (value, element)
            {
                // return this.optional(element) || /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-,.!_@ ])*$/.test(value);
                return this.optional(element) || /^[\p{L}\p{M}\s\-.,!_@]+$/u.test(value);
            }, "Letters and spaces only please");


        $.validator.addMethod("numberpass",
            function(value, element, param) {
               if (!/[0-9]/.test(value)) {
                    return false;
                }
                return true;
        },"Include at least 1 number.");

        $.validator.addMethod("noSpace", function(value, element) {
            return value.indexOf(" ") < 0 && value != "";
        }, "No space please");
        $.validator.addMethod("phoneminlength", function(value, element, param) {
        custom_value = value.replace(/[^\d.-]/g, '');
        custom_value = custom_value.replace(/-/g, '');

         return this.optional(element) || custom_value.length == param;
        }, $.validator.format("Please enter exactly {0} characters."));
        $.validator.addMethod("phonemaxlength", function(value, element, param) {
        custom_value = value.replace(/[^\d.-]/g, '');
        custom_value = custom_value.replace(/-/g, '');

         return this.optional(element) || custom_value.length == param;
        }, $.validator.format("Please enter exactly {0} characters."));

        $.validator.addMethod(
            "minImageCount",
            function(value, element, param) {
                // Check if the field has a value
                if (value.trim() === "") {
                    return false; // Required validation
                }
                var totalImageCount = value.split(",").map(function(v) {
                    return v.trim();
                });
                return totalImageCount.length >= param; // Validate against the minimum count
            },
            "Please upload at least {0} images."
        );

        $.validator.addMethod(
            "maxImageCount",
            function(value, element, param) {
                if (value.trim() === "") {
                    return true; // Allow empty input; handle required separately
                }
                var totalDeedCount = value.split(",").map(function(v) {
                    return v.trim();
                });
                return totalDeedCount.length <= param; // Validate against the maximum count
            },
            "You can only upload a maximum of {0} document."
        );

        $.validator.addMethod("totalPercentage", function(value, element) {
            let total = 0;
            $('.owner_percentage').each(function () {
                const val = parseFloat($(this).val());
                if (!isNaN(val)) {
                    total += val;
                }
            });
            return total <= 100;
        }, "Total ownership percentage must not exceed 100%");

        $.validator.addMethod("atLeast18YearsOld_old", function(value, element) {
            if (!value) return true; // Allow empty value (optional)

            const selectedDate = new Date(value);
            if (isNaN(selectedDate.getTime())) return false;

            const today = new Date();

            // Calculate 18 years ago from today
            const eighteenYearsAgo = new Date(
                today.getFullYear() - 18,
                today.getMonth(),
                today.getDate()
            );

            // The selected date must be on or before 18 years ago
            return selectedDate <= eighteenYearsAgo;

        }, "You must be at least 18 years old.");

        // $.validator.addMethod("atLeast18YearsOld", function(value, element) {
        //     if (!value) return true;

        //     const selectedDate = new Date(value);
        //     if (isNaN(selectedDate.getTime())) return false;

        //     const today = new Date();
        //     const eighteenYearsAgo = new Date(
        //         today.getFullYear() - 18,
        //         today.getMonth(),
        //         today.getDate()
        //     );

        //     return selectedDate <= eighteenYearsAgo;

        // }, "You must be at least 18 years old.");

        $.validator.addMethod("atLeast18YearsOld", function(value, element) {
            if (!value) return true;

            const selectedDate = new Date(value + "T00:00:00");  // normalize to midnight
            if (isNaN(selectedDate.getTime())) return false;

            const today = new Date();
            const eighteenYearsAgo = new Date(
                today.getFullYear() - 18,
                today.getMonth(),
                today.getDate()
            );

            // Normalize both dates to midnight to avoid time-of-day differences
            selectedDate.setHours(0, 0, 0, 0);
            eighteenYearsAgo.setHours(0, 0, 0, 0);

            return selectedDate <= eighteenYearsAgo;

        }, "You must be at least 18 years old.");

        $.validator.addMethod("strongPassword", function(value, element) {
            return this.optional(element) || 
                value.length >= 8 &&
                /[A-Z]/.test(value) &&           // Uppercase
                /[a-z]/.test(value) &&           // Lowercase
                /\d/.test(value) &&              // Number
                /[!@#$%^&*]/.test(value);        // Special character
        }, "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");


        $.validator.addMethod("atLeastOneAlpha", function(value, element) {
            return this.optional(element) || /[a-zA-Z]/.test(value);
        }, "Must contain at least one alphabetic character.");

        $.extend($.validator.messages, {
            min: "Please enter a valid value",
            greaterThanValue: "Please enter a valid value",
        });


});