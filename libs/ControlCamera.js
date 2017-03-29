/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.ControlCamera = function ( object, domElement, bool ) {

	this.object = object;
	this.bool = bool;
	this.target = new THREE.Vector3( 0, 0, 0 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.movementSpeed = 1.0;
	this.lookSpeed = 0.005;

	this.lookVertical = true;
	this.autoForward = false;
	// this.invertVertical = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.freeze = false;

	this.mouseDragOn = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', -1 );

	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;

			}

		}

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}

		this.mouseDragOn = false;

	};

	this.onKeyDown = function ( event ) {

		//event.preventDefault();

		switch ( event.keyCode ) {

			//case 38: /*up*/
			case 87: /*W*/
				//this.moveForward = true; 
				this.mouseY = -75;
				break;

			//case 37: /*left*/
			case 65: /*A*/ 
				//this.moveLeft = true; 
				this.mouseX = -75;
				break;

			//case 40: /*down*/
			case 83: /*S*/ 
				//this.moveBackward = true; 
				this.mouseY = 75;
				break;

			//case 39: /*right*/
			case 68: /*D*/ 
				//this.moveRight = true; 
				this.mouseX = 75;
				break;


			case 81: /*Q*/ this.freeze = !this.freeze; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ 
				//this.moveForward = false; 
				this.mouseY = 0;
				break;

			case 37: /*left*/
			case 65: /*A*/ 
				//this.moveLeft = false; 
				this.mouseX = 0; 
				break;

			case 40: /*down*/
			case 83: /*S*/ 
				//this.moveBackward = false;
				this.mouseY = 0; 
				break;

			case 39: /*right*/
			case 68: /*D*/ 
				// this.moveRight = false; 
				this.mouseX = 0;
				break;

		}

	};

	this.update = function( delta ) {

		if ( this.freeze ) {

			return;

		}

		if ( this.heightSpeed ) {

			var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
			var heightDelta = y - this.heightMin;

			this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

		} else {

			this.autoSpeedFactor = 0.0;

		}

		var actualMoveSpeed = delta * this.movementSpeed;
		var go = - ( actualMoveSpeed + this.autoSpeedFactor );
		if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) this.object.translateZ( go );
		if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

		var actualLookSpeed = delta * this.lookSpeed;

		if ( !this.activeLook ) {

			actualLookSpeed = 0;

		}

		var verticalLookRatio = 1;

		if ( this.constrainVertical ) {

			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		}

		/****************************************************************************************************/
		/****************************************************************************************************/
		/************************************	CONTROL SLIDER CAMERA 2 	*********************************/
		/****************************************************************************************************/
		/****************************************************************************************************/
		if (bool == false ) {
			var step = 0;
			$('#defaultslide1_LR').slider();
			var cur_val_lr = $("#defaultslide1_LR").slider("value");

			if ( (cur_val_lr <= -180 && this.mouseX < 0) || (cur_val_lr >= 180 && this.mouseX > 0) ) {
				this.lon += 0;
				step =0;
			}
			else {
				if (this.mouseX < 0) {
					step = -1;
				}
				else if (this.mouseX > 0) {
					step = 1
				}
				this.lon += Math.round(this.mouseX *actualLookSpeed);
			} 
			this.mouseX = 0;

			$('#defaultslide1_LR').slider();
			var cur_val_lr = $("#defaultslide1_LR").slider("value");
			$('#currentval1_LR').html(cur_val_lr + step);
			$("#defaultslide1_LR").slider("option", "value", cur_val_lr + step);

			if( this.lookVertical ) 
				this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;
			this.lat = Math.max( - 85, Math.min( 85, this.lat ) );

			$('#defaultslide1_UD').slider();
			var cur_val_ud = Math.round(this.lat);
			$('#currentval1_UD').html(cur_val_ud);
			$("#defaultslide1_UD").slider("option", "value", cur_val_ud);


		}
		/****************************************************************************************************/
		/****************************************************************************************************/
		/************************************	CONTROL SLIDER CAMERA 1 	*********************************/
		/****************************************************************************************************/
		/****************************************************************************************************/
		if (bool == true ) {
			var step = 0;
			$('#defaultslide_LR').slider();
			var cur_val_lr = $("#defaultslide_LR").slider("value");

			if ( (cur_val_lr <= -180 && this.mouseX < 0) || (cur_val_lr >= 180 && this.mouseX > 0) ) {
				this.lon += 0;
				step =0;
			}
			else {
				if (this.mouseX < 0) {
					step = -1;
				}
				else if (this.mouseX > 0) {
					step = 1
				}
				this.lon += Math.round(this.mouseX *actualLookSpeed);
			} 
			this.mouseX = 0;

			$('#defaultslide_LR').slider();
			var cur_val_lr = $("#defaultslide_LR").slider("value");
			$('#currentval_LR').html(cur_val_lr + step);
			$("#defaultslide_LR").slider("option", "value", cur_val_lr + step);

			if( this.lookVertical ) 
				this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;
			this.lat = Math.max( - 180, Math.min( 50, this.lat ) );

			$('#defaultslide_UD').slider();
			var cur_val_ud = Math.round(this.lat);
			$('#currentval_UD').html(cur_val_ud);
			$("#defaultslide_UD").slider("option", "value", cur_val_ud);


		}

		/***************************************** END CONTROL **********************************************/

		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		if ( this.constrainVertical ) {

			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( targetPosition );

	};


	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	if(bool == true) {
		this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
		this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
		this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
	}
	this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
	this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.handleResize();

};
