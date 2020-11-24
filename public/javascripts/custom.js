$().ready(function() {
    $( "#country" ).change(function() {
    	var country = $( "#country" ).val();
    	$("#country option[value='0']").remove();

       	$.ajax({ url: "SearchRegion.php",
         data: {course_id: country},
         type: 'get',
         async: false,
         success:
         function(msg) {
         	$('#region').find('option').remove().end();
         	var region = jQuery.parseJSON(msg);
         	for(var i = 0 ; i < region.length ; i++)
         	{
         		$('#region').append('<option value="'+region[i].sem_id+'">'+region[i].sem_name+'</option>');
         	}
       	 }
        });
    	$('#city').find('option').remove().end();
    	$('#city').append('<option value="0">Please choose a Region/State</option>');

	});

	$( "#region" ).change(function() {
    	var region = $( "#region" ).val();
        $.ajax({ url: "SearchCity.php",
         data: {sem_id: region},
         type: 'get',
         async: false,
         success:
         function(msg) {
         	$('#city').find('option').remove().end();
         	var city = jQuery.parseJSON(msg);
         	for(var i = 0 ; i < city.length ; i++)
         	{
         		$('#city').append('<option value="'+city[i].sub_type_id+'">'+city[i].sub_type_name+'</option>');
         	}
       	 }
        });
	});	
});