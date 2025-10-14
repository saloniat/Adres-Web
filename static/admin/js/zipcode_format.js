$(document).on('keyup', '#add_employee_form #zip_code, #add_agent_form #zip_code', function(){
  // const value = $(this).val();
  // // Replace any non-digit character with an empty string
  // if (!/^\d*$/.test(value)) {
  //     $(this).val(value.replace(/\D/g, ''));
  // }

  let value = $(this).val();
  // Allow only numbers and limit length to 5 characters
  value = value.replace(/\D/g, ''); // Remove non-numeric characters
  if (value.length > 5) {
    value = value.substring(0, 5); // Truncate to 5 characters
  }
  $(this).val(value);
});
