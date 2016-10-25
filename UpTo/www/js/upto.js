$(document).ready(function() {
	resizeSlider();
});

$(window).resize(function() {
	resizeSlider();
});

function resizeSlider()
{
	// Carousel width
	var carouselW = $("#carousel").css("width").split("px")[0];

	// Calcul new image margin left to center
	if (carouselW < 975)
	{
		var newImgML = (975 - carouselW) / 2;
		$(".item img").css("min-width", "950px !important");
		$(".item img").css("margin-left", "-"+newImgML+"px");
	}
	else {
					$(".item img").css("min-width", "0px");
					$(".item img").css("margin-left", "0px");
			 }

	if (carouselW < 500)
	{
		enablePortableCaption = true;
	}
	else enablePortableCaption = false;
}

var enablePortableCaption = false;

function tooglePortableCaption()
{
		var id = $("#carousel .item.active .carousel-caption").attr("data-id");
		console.log(id);

		if (enablePortableCaption)
		{
				// Display none all default carousel caption
				$("#carousel .item .carousel-caption").css("display", "none");
				// Dispaly all portable carousel caption
				$(".container_carousel .carousel-portablecaption").css("display", "none");
				// Display only portable caption id
				$("#portablecaption"+id).css("display", "block");
		}
		else {
						$(".container_carousel .carousel-portablecaption").css("display", "none");
						$("#carousel .item .carousel-caption").css("display", "block");
				 }
}

setInterval(tooglePortableCaption, 200);

// Return a XHR object
function getXMLHttpRequest()
{
	var xhr = null;

	if (window.XMLHttpRequest || window.ActiveXObject)
	{
		if (window.ActiveXObject)
		{
			try
			{
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e)
				{
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}
		} else
			{
				xhr = new XMLHttpRequest();
			}
	} else
		{
			alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
			return null;
		}

	return xhr;
}

// Request AJAX
// Param: Page of the request, value of parameters and callback function
function request(page, param_value, callback)
{
    var xhr = getXMLHttpRequest();

    xhr.onreadystatechange = function()
    {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
        {
            callback(xhr.responseText);
        }
    };

    xhr.open("POST", page, false);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var param = "parameter=" + param_value;
    xhr.send(param);
}

// Return if a name is valid
function isValidName(name)
{
  if(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð-]{2,40}$/i.test(name))
  {
  	return true;
  }

  return false
}

// Return if a firstname is valid
function isValidFirstname(name)
{
  if(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð-]{2,40}$/i.test(name))
  {
  	return true;
  }

  return false
}

// Return if a mail adress is valid
function isValidEmail(email)
{
  if(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-zA-Z]{2,4}$/.test(email))
  {
    return true;
  }

  return false
}

// Return if a subject is valid
function isValidSubject(subject)
{
  var reg = new RegExp(".{6,60}");
	var reg2 = new RegExp("\\s{30,60}");
	var reg3 = new RegExp("^\\s{0,60}$");

	// reg.test(message) && !reg2.test(message) &&
  if(reg.test(subject) && !reg2.test(subject) && !reg3.test(subject))
  {
    return true;
  }

  return false;
}

// Return if a message is valid
function isValidMessage(message)
{
  var reg = new RegExp(".{20,360}");
	var reg2 = new RegExp("\\s{100,360}");
	var reg3 = new RegExp("^\\s{0,360}$");

	// reg.test(message) && !reg2.test(message) &&
  if(reg.test(message) && !reg2.test(message) && !reg3.test(message))
  {
    return true;
  }

  return false;
}

var valid_captcha = false;

function analyzeCaptcha(response)
{
    if (response == "Success")
    {
        valid_captcha = true;
    }
    else valid_captcha = false;
}

function isValidCaptcha(captcha)
{
    request("ajax/valid_captcha.php", captcha, analyzeCaptcha);

    if(valid_captcha)
    {
        return true;
    }

    return false;
}

(function()
{
  // Document ready, reset form
  jQuery(document).ready(function()
  {
      // Reset form
      jQuery('.contact-form').each(function()
      {
        this.reset();
      });
  });

  // Array to know if possible to send a message
  var valids = {
    name: false,
    firstname: false,
    email: false,
    message: false,
    captcha: false
  };

  function resetValids()
  {
    for (var id in valids)
    {
      valids[id] = false;
    }
  }

  function addBlurListener(contact_bloc, field)
  {
    jQuery("#"+contact_bloc).on("blur", "#"+field, function()
    {
      var val = jQuery("#"+field).val();
      var func_name = "isValid"+field.charAt(0).toUpperCase()+field.slice(1);
      var func_params = [val];
      var func = window[func_name];

      if (typeof func === "function")
      {

        if (!func.apply(null, func_params))
        {
          // Form Control
          jQuery("."+field+"-form").removeClass("has-success");
          jQuery("."+field+"-form").addClass("has-error");
          // Change feedback
          jQuery("."+field+"-feedback").addClass("feedback");
          jQuery("."+field+"-feedback").removeClass("glyphicon-ok");
          jQuery("."+field+"-feedback").addClass("glyphicon-remove");
          // Add error message
          jQuery("."+field+"-error").addClass("error");

          // Non valid
          valids[field] = false;
        }
        else
            {
              // Form Control
              jQuery("."+field+"-form").removeClass("has-error");
              jQuery("."+field+"-form").addClass("has-success");
              // Change feedback
              jQuery("."+field+"-feedback").addClass("feedback");
              jQuery("."+field+"-feedback").removeClass("glyphicon-remove");
              jQuery("."+field+"-feedback").addClass("glyphicon-ok");
              // Remove error message
              jQuery("."+field+"-error").removeClass("error");

              // Valid
              valids[field] = true;
            }

        isValidForm();

      }

    });
  }

  function addListenerForm()
  {
    // Add blur on input
    jQuery("#contact-content input").each(function()
    {
      addBlurListener("contact-content", this.id);
    });

    // Add blur on textarea
    jQuery("#contact-content textarea").each(function()
    {
      addBlurListener("contact-content", this.id);
    });
  }

  addListenerForm();

  // Enable submit if the form is valid
  jQuery("#contact-content").on("click", '#submit', function()
  {
    return isValidForm();
  });

  // Return true if the form is valid, false else
  function isValidForm()
  {
    var error = false;

    for (var id in valids)
    {
      if(!valids[id])
      {
        error = true;
        break;
      }
    }

    if(error)
    {
      jQuery(".form-error").addClass("error");
    }
    else jQuery(".form-error").removeClass("error");

    return !error;
  }

  // CLick on reload form button, reload form
  jQuery('#contact-content').on('click', '#reload-form', function()
  {
      reloadForm();
  });
    
    // Refresh captcha
    jQuery('#contact-content').on('click', '#refresh-captcha', function()
    {
        $('#image-captcha').attr('src','php/captcha.php?param='+new Date().getTime());
    });

  // Submit send a ajax request to contact page
  jQuery('#contact-content').on('submit', '#contact-form', function(e)
  {
    e.preventDefault();
    var jQueryform = jQuery('#contact-form');
    jQuery.post(jQueryform.attr("action"), jQueryform.serialize())
    .done(function(data)
    {
      SuccessfulMessage();
    })
    .fail(function()
    {
      UnsuccessfulMessage();
    });
  });

  // Add to contact content html, the successful html
  function SuccessfulMessage()
  {
    var success = '<div class="row">'+
                    '<div class="col-xs-12">'+
                      '<span class="glyphicon glyphicon-envelope"></span>'+
                      '<p>'+
                        'Votre message a bien été envoyé'+
                      '</p>'+
                    '</div>'+
                    '<div class="col-xs-12">'+
                      '<button id="reload-form" type="submit" class="btn btn-lg" autocomplete="off">Recharger le Formulaire</button>'+
                    '</div>'+
                  '</div>';

    jQuery('#contact-content').html(success);
  }

  // Add to contact content html, the unsuccessful html
  function UnsuccessfulMessage()
  {
    var unsuccess = '<div class="row">'+
                    '<div class="col-xs-12">'+
                      '<span class="glyphicon glyphicon-envelope red"></span>'+
                      '<p class="red">'+
                        'Votre message n\'a pas pu être envoyé'+
                      '</p>'+
                    '</div>'+
                    '<div class="col-xs-12">'+
                      '<button id="reload-form" type="submit" class="btn btn-lg" autocomplete="off">Recharger le Formulaire</button>'+
                    '</div>'+
                  '</div>';

    jQuery('#contact-content').html(unsuccess);
  }

  // Add to contact content html, the form
  function reloadForm()
  {
      var reload = '<form id="contact-form" class="contact" action="ajax/contact.html" method="post">'+
                    '<div class="row">'+
                      '<div class="col-xs-12">'+
                        '<div class="form-group has-feedback name-form">'+
                          '<label class="control-label" for="name">Nom <span class="required">*</span> : </label>'+
                          '<input id="name" type="text" class="form-control">'+
                          '<span class="glyphicon glyphicon-remove form-control-feedback name-feedback"></span>'+
                          '<p class="name-error">'+
                            'Votre nom ne correspond pas aux critères.<br>'+
                            'Entre 2 et 40 lettres.'+
                          '</p>'+
                        '</div>'+
                        '<div class="form-group has-feedback firstname-form">'+
                          '<label class="control-label" for="firstname">Prénom <span class="required">*</span> : </label>'+
                          '<input id="firstname" type="text" class="form-control">'+
                          '<span class="glyphicon glyphicon-remove form-control-feedback firstname-feedback"></span>'+
                          '<p class="firstname-error">'+
                            'Votre prénom ne correspond pas aux critères.<br>'+
                            'Entre 2 et 40 lettres.'+
                          '</p>'+
                        '</div>'+
                        '<div class="form-group has-feedback email-form">'+
                          '<label class="control-label" for="email">Email <span class="required">*</span> : </label>'+
                          '<input id="email" type="email" class="form-control">'+
                          '<span class="glyphicon glyphicon-remove form-control-feedback email-feedback"></span>'+
                          '<p class="email-error">'+
                            'L\'adresse email n\'est pas au bon format.'+
                          '</p>'+
                        '</div>'+
                        '<div class="form-group has-feedback message-form">'+
                          '<label class="control-label" for="message">Message <span class="required">*</span> : </label>'+
                          '<textarea id="message" type="textarea" class="form-control"></textarea>'+
                          '<span class="glyphicon glyphicon-remove form-control-feedback message-feedback"></span>'+
                          '<p class="message-error">'+
                            'Votre message ne correspond pas aux critères.<br>'+
                            'Entre 20 et 360 caractères.'+
                          '</p>'+
                        '</div>'+
                      '</div>'+
                      '<div class="col-xs-12">'+
                        '<div class="row">'+
                          '<div class="col-xs-12">'+
                            '<button id="submit" type="submit" class="btn btn-lg pull-right" autocomplete="off">Envoyer</button>'+
                          '</div>'+
                          '<div class="col-xs-12">'+
                            '<p class="form-error">'+
                              'Un champ (ou plusieurs) n\'est pas correct.'+
                            '</p>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                      '<div class="col-xs-12">'+
                        '<span class="pull-left required">* : Champ obligatoire</span>'+
                      '</div>'+
                    '</div>'+
                  '</form>';
      resetValids();
      jQuery('#contact-content').html(reload);
  }

}) ();

// Scrolling aside "reseaux sociaux"
var amountScrolledTop = 50;
var amountScrolled = 4300;

$(window).scroll(function() {

	// Top of footer
	var footer = $('footer').offset().top;
	// Top of upto part
	var upto = $('#upto').offset().top;
	// Current scroll
	var scroll = $(window).scrollTop();

	if( (scroll >= upto) && (scroll <= footer))
	{
		$('.social-network').fadeIn('fast');
	}
	else $('.social-network').fadeOut('fast');

});

// Menu hambuger
$('#navicon').on('click', function() //contrôle le clic sur le navicon
{
  if($('#menu').css('display') == 'none') //si le menu n'est pas visible
  {
    $('#menu').css('position', 'fixed'); //on le fixe
    $('#menu').fadeIn(500); //transition
    $('#menu').css('display', 'flex'); //on le passe en flex
    $('#menu a').attr('class', 'slideInDown animated'); //animation du texte

  }
  else //si le menu est visible
  {
    $('#menu').css('position', 'auto'); //on enleve le fixed
    $('#menu').fadeOut(500, 'linear'); //transition
    $('#menu a').attr('class', 'slideOutDown animated'); //animation du texte
  }
})

$('#menu li').on('click', function() //smooth scroll
{
  $('#menu').css('position', 'auto'); //on enleve le fixed
  $('#menu').fadeOut(500, 'linear'); //transition
  $('#menu a').attr('class', 'slideOutDown animated'); //animation du texte
  //reste à integrer le smooth scroll !

      var page = $(this).attr('href'); // Page cible
			var speed = 750; // Durée de l'animation (en ms)
			$('html, body').animate( { scrollTop: $(page).offset().top }, speed ); // Go

})

// Modal
$(document).ready(function(){
  $("#myModal").on('hide.bs.modal');
  $("#myModal").on('show.bs.modal');
});
