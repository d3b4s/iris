/**
 * Makes a set of UIs and DOM elements validate in group.
 * 
 * @AppliesTo uis, DOM elements
 * @Example iris.ApplyAddOn("validator.js", [_UI1, _UI2, _$DOM1]);
 * @ValidationTypes for DOM elements ( specified in the data-validate attribute )
 * 		- required -> validate that the DOM element ( el.val() ) is not empty
 * 		- numeric -> validate that the DOM element ( el.val() ) is numeric
 * @Public
 * 		- IsValid -> returns a boolean indicating when all the components are valid or not
 * 		- GetErrorMessages -> return an array with all error messages generated by components and DOM elements
 * 
 * If you want to add a UI to a validator, you have to consider:
 * 	- The UI must have a public Validate method. If this method doesn't return TRUE or dosen't exists, the AddOn considers that the UI doesn't validate.
 * 		In this method you can highlight in red or whatever you want to visual represent the validation error in the UI.
 *  - The UI can have a public ValidateError that return the error literal. If not, the error generates without a description.
 * If you want to validate a DOM element (normally a input), you have to consider:
 *  - The DOM element must have a data-validate attribute with any validation type supported by this AddOn. If not, the element always pass the validation
 *  - If the DOM element have a data-validate-name attribute, its value will be appended in the error description
 *  - If the DOM element doesn't validate it will receive the class _ValidationErrorClass
 *  
 */
iris.AddOn(

	function( self ) {
		
		var   _ErrorMessages = []
			, _ValidationErrorClass = "validation-error"
		;
		
		// LyfeCycle
		self.Create = function() {
			iris.D("AddOn Validator Applied");
		};
		
		function _IsValid(){
			_ErrorMessages = [];
			
			var allValid = true, el;
			for ( var f=0, F=self.Size(); f < F; f++ ) {
				el = self.Get(f);
				
				if( _IsUiComponent( el ) ){
					if( el.hasOwnProperty("Validate") ){
						if( el.Validate() !== true ){
							allValid = false;
							_ErrorMessages[_ErrorMessages.length] = el.hasOwnProperty("ValidateError") ? el.ValidateError() : "";
						}
					} else {
						allValid = false;
						_ErrorMessages[_ErrorMessages.length] = el.hasOwnProperty("ValidateError") ? el.ValidateError() : "";
					}
				} else {

					el.removeClass( _ValidationErrorClass );
					if( el.data("validate") ){
						var validations = el.data("validate").split(" ");

						for( var g=0, G=validations.length; g<G; g++ ) {
							var validation = validations[g];
							
							if( validation == "required" ){
								if( el.val() == "" ){
									allValid = false;
									_ErrorMessages[_ErrorMessages.length] = ( el.data("validate-name") ? el.data("validate-name") + " is a " : "" ) + "required field";
									el.addClass( _ValidationErrorClass );
								}
							}
							
							if( validation == "numeric" ){
								if( isNaN(el.val() ) ){
									allValid = false;
									_ErrorMessages[_ErrorMessages.length] = ( el.data("validate-name") ? el.data("validate-name") + " " : "" ) + "must be numeric";
									el.addClass( _ValidationErrorClass );
								}
							}
						}
					} else {
						iris.W("[AddOn validator] DOM element without a data-validation attribute");
					}
				}
			}
			return allValid;
		}
		
		function _IsUiComponent( p_el ){
			return p_el.hasOwnProperty("__Id__");
		}
		
		function _GetErrorMessages(){
			return _ErrorMessages;
		}
		
		self.IsValid = _IsValid;
		self.ErrorMessages = _GetErrorMessages;
	}
);