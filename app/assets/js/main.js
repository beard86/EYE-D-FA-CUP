'use strict';
 /*jshint unused:false*/
var App;

(function ($, window, document, undefined) {
var appLang = $('html').attr('lang'),
    $body = $('body'),
    wH, wW, pixelDensity = window.devicePixelRatio || 1,
    dragging = !1,
    scrolling = !1,
    transitioning = !1,
    transitionTimer, onResizeTimer, mobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? !0 : !1,
    isIE9 = $('html').hasClass('ie9') ? !0 : !1,
    isiOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? !0 : !1,
    isiOS8 = navigator.userAgent.match(/(iPad|iPhone|iPod).*OS 8_\d/i),
    isChrome = navigator.userAgent.indexOf('Chrome') > -1,
    isExplorer = navigator.userAgent.indexOf('MSIE') > -1,
    isFirefox = navigator.userAgent.indexOf('Firefox') > -1,
    isSafari = navigator.userAgent.indexOf('Safari') > -1,
    isOpera = navigator.userAgent.indexOf('Presto') > -1;
var mousewheelevt = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'wheel',
    sections = [],
    currentSection = 0,
    trValues = [],
    listItems = $('#sliders section'),
    stripe = document.getElementById('stripe'),
    iPhone = $('#video-container'),
    largeScreen = $('#large-video'),
    wideContent = $('#wide-content'),
    dayScreens = $('#day-screens'),
    sliderTitles = $('#titles'),
    sliderSection = $('#titles h3 span'),
    video = $('#video')[0],
    videoTwo = $('#video2')[0],
    timelineCtn = $('#timeline-ctn'),

    wideContentTransVal, largeScreenTransVal, iPhoneTransVal, slider, lastSwipeProgress, lastViableProgress, slidesNumber, touchmoveDisabled = !1;


  $(function () { App.init(); });

  /*
  [-------- Application -------]
  */
	App = {
        isDebug : true,
        landscape : true,
		swiperSettings: 0,
		splashFaders:false,
		init : function() {

			App.eventHandlers();
			App.setDefaults();

		},
		setDefaults: function() {
			App.scrollHandlers();
			App.setHeightOther();
            App.layoutSettings();
            
            //init Navigation
            $('section').each(function(e) {
                sections[e] = new App.Section(e);
            }), App.getTransitionValues();

		},
        layoutSettings : function() {
            //layout Settings
            wW = window.innerWidth, 
            wH = $(window).height(),
            wideContentTransVal = wideContent.height() - (wH - wideContent.height()),
            largeScreenTransVal = -largeScreen.height() - (wH - largeScreen.height()) / 2,
            iPhoneTransVal = -iPhone.height() - (wH - iPhone.height()) / 2, 
            740 >= wW ? slider || App.initSlider() : slider && (slider.destroy(), 
            slider = null, 
            $('.swiper-slide').width('')), 
            mobile && (wW > 740 && !touchmoveDisabled ? App.tabletScroll.init() : App.tabletScroll.kill());
            console.log(wideContentTransVal, largeScreenTransVal, iPhoneTransVal);

        },
		eventHandlers : function(){

			$('body').on('click touchend', '#home-btn', function(event){
				event.preventDefault();
				location.href= 'index.html';
			});

			$('body').on('click touchend', '#down', function(event){
				event.preventDefault();
				App.goToSection('#intro');
			});
			$('body').on('click touchend', '#down-intro', function(event){
				event.preventDefault();
				App.goToSection('#sliders');
			});
            var distance = $('#sliders').offset().top -100,
                $window = $(window);
            $window.scroll(function() {
                if ( $window.scrollTop() >= distance ) {
                    console.log('sliders top');
                    //$(document).bind(mousewheelevt, App.mouseWheelHandler);
                }
            });
            $(window).resize(function() {
                App.setHeightOther(),
                App.layoutSettings(),  
                App.getTransitionValues(), 
                wW > 740 && (clearTimeout(onResizeTimer), 
                onResizeTimer = setTimeout(function() {
                    sections[currentSection].animate();
                }, 100));
            });
		},

        goToSection: function(id) {
            $('html, body').animate({
                scrollTop: $(id).offset().top - 50
            }, 500);
        },


		setHeightOther: function () {
            //ensure height adjusts on resize
            //console.log('setting - height');
			var windowHeightminus = $(window).height() - 50;
			var windowHeightminusonthego = $(window).height() - 0;
			var windowHeight = $(window).height();

			var heroContent = $('#hero .main-content').outerHeight(true);
			if (windowHeightminus > heroContent) {
				$('#wrapper>section').css('height', windowHeightminus);
			} else {
			   $('#wrapper>section').css('height', heroContent); 
			}

            var introContent = $('#intro .main-content').outerHeight(true);
            if (windowHeightminus > introContent) {
                $('#wrapper>section').css('height', windowHeightminus);
            } else {
               $('#wrapper>section').css('height', introContent); 
            }

            var sliderContent = $('#intro .main-content').outerHeight(true);
            if (windowHeightminus > sliderContent) {
                $('#wrapper>section').css('height', windowHeightminus);
            } else {
               $('#wrapper>section').css('height', sliderContent); 
            }

            var contactContent = $('#intro .main-content').outerHeight(true);
            if (windowHeightminus > contactContent) {
                $('#wrapper>section').css('height', windowHeightminus);
            } else {
               $('#wrapper>section').css('height', contactContent); 
            }
		},

        scrollHandlers: function() {

                var easing = {
                    // no easing, no acceleration
                    linear: function(t) {
                        return t;
                    },
                };

                // header minifies on scroll
                var scrolltimeout = null;
                var scrolldelta = Math.round(document.body.scrollTop || document.documentElement.scrollTop || 0);
                var scrolltemp = 0;
                var prevscroll = window.scrollY;
                var down = document.querySelectorAll('.down')[0];
                down.hider = false;
                down.trigger = 150;
                var heroimage = document.querySelectorAll('#hero img');

                function downCheck() {
                    if (!down.hider) {
                        if (scrolldelta > down.trigger) {
                            down.classList.add('fade');
                            setTimeout(function() {
                                down.classList.add('hide');
                            }, 500);
                            down.hider = true;
                        }
                    } else {
                        if (scrolldelta < down.trigger) {
                            down.classList.remove('hide');
                            setTimeout(function() {
                                down.classList.remove('fade');
                            }, 100);
                            down.hider = false;
                        }
                    }
                }

                window.onscroll = function() {
                    scrolltemp = document.body.scrollTop || document.documentElement.scrollTop || 0;
                    scrolltemp = prevscroll - scrolltemp;
                    scrolldelta -= scrolltemp;
                    var herotemp = scrolldelta / 2.4;
                    if (herotemp < 0) {
                        herotemp = 0;
                    }
                    downCheck();
                    for (var i = 0; i < heroimage.length; i++) {
                        heroimage[i].style.transform = 'translateY(' + herotemp + 'px)';
                    }
					var distanceY = window.pageYOffset || document.documentElement.scrollTop,
					    shrinkOn = $('#intro').offset().top-50,
                        bindMouseWheel = $('#sliders').offset().top-50,
					    header = document.querySelector('header'),
                        headerLogo = document.querySelector('.logo'),
                        centerTitle = document.querySelector('.title');

					if (distanceY > shrinkOn) {
					    classie.add(header,'smaller');
                        classie.add(headerLogo, 'hidden');
                        classie.remove(centerTitle, 'center-title');
					} else {
					    if (classie.has(header,'smaller')) {
					        classie.remove(header,'smaller');
                            classie.remove(headerLogo, 'hidden');
                            classie.add(centerTitle, 'center-title');
					    }
					}

                    if (distanceY > bindMouseWheel && currentSection === 0) {
                        console.log('mouse wheel bound');
                        $body.attr('data-started',true),
                        $body.attr('data-forward',true),
                        $('.swiper-container, #sections-list').addClass('z-index20');
                        App.goToSection('#sliders');
                        $(document).bind(mousewheelevt, App.mouseWheelHandler);
                        //App.initSlider();
                    }

                    prevscroll = document.body.scrollTop || document.documentElement.scrollTop || 0;
                };

                downCheck();

        },
        mouseWheelHandler: function(e) {
            e.preventDefault();
            if (wW > 740) {
                //console.log(wW);
                var winEvent = window.event || e,
                    winEvent = winEvent.originalEvent ? winEvent.originalEvent : winEvent,
                    i = 'wheel' === winEvent.type ? winEvent.wheelDelta : -40 * winEvent.detail;
                if (!transitioning) {
                    console.log('not transitioning');
                    winEvent.preventDefault();
                    var n;
                    i > 0 ? currentSection > 0 && (currentSection--, n = !1) : 0 > i && currentSection < sections.length - 1 && (currentSection++, n = !0), 
                    0 !== i && (transitioning = !0, sections[currentSection].animate(n));
                }
            }
        },
        scrollTo: function(Y, duration, easingFunction, callback) {
            var start = Date.now();
            var from = document.body.scrollTop || document.documentElement.scrollTop || 0;

            if (from === Y) {
                return; /* Prevent scrolling to the Y point if already there */
            }

            function min(a, b) {
                return a < b ? a : b;
            }

            function scroll() {
                var currentTime = Date.now(),
                    time = min(1, ((currentTime - start) / duration)),
                    easedT = easingFunction(time);

                var tempscroll = (easedT * (Y - from)) + from;
                document.body.scrollTop = tempscroll;
                document.documentElement.scrollTop = tempscroll;

                if (time < 1) {
                    requestAnimationFrame(scroll);
                } else {
                    if (callback) {
                        callback();
                    }
                }
            }
            requestAnimationFrame(scroll);
        },
        initSlider: function() {
            $('#sections-list section').eq(0).addClass('current'), 
            $('#slider-nav li').eq(0).addClass('current'), 
            this.slider = $('.swiper-container').swiper({
                direction: 'horizontal',
                speed: 700,
                autoResize: !0,
                resistanceRatio: 0.7,
                longSwipesRatio: 0,
                spaceBetween: 0,
                onInit: function(e) {
                    lastSwipeProgress = e.progress;
                },
                onTransitionStart: function(e) {
                    $body.removeClass('slide-change');
                },
                onProgress: function(e, t) {
                    //rotateSlide(e, t), 
                    $body.addClass('slide-change');
                },
                onSlideChangeEnd: function(e) {
                    lastSwipeProgress = e.progress, 
                    $('#sections-list section').removeClass('current').eq(e.activeIndex).addClass('current'), $('#slider-nav li').removeClass('current').eq(e.activeIndex).addClass('current');
                }
            }), 
            this.slidesNumber = $('.swiper-slide').length, 
            $(document).on('click touchend', '#slider-nav a', function(e) {
                e.preventDefault();
            });
        },
        Section: function(e) {
            var t = this;
            t.index = e, 
            t.DOMel = $('section').eq(e), 
            t.article = 
            t.DOMel.find('article'),
            t.title = t.DOMel.find('h2'), 
            t.paragraph = t.DOMel.find('p'), 
            t.animate = function(e, i) {
                0 === currentSection ? $body.removeClass('started') : $body.addClass('started'), 
                $body.attr('data-forward', e),
                $body.attr('data-started', true),
                $body.attr('data-current-section', currentSection),
                listItems.removeClass('current'), 
                $('.nav-btn').prop('disabled', !1), 
                0 === currentSection && $('.nav-btn.up').prop('disabled', !0), 
                currentSection === sections.length - 1 && $('.nav-btn.down').prop('disabled', !0);
                var n = e ? trValues[t.index].article.delay.forward : trValues[t.index].article.delay.backward;
                console.log('currentSection', currentSection);
                //if last section unbind mousewheel control & remove absolute positioning
                if(currentSection === 10){
                    $body.attr('data-started', false);
                    $body.attr('data-ended', true);
                }

                if (i) {
                    var r = stripe._gsTransform ? stripe._gsTransform.rotation : 0;
                    console.log(r);
                    TweenMax.to(
                        iPhone, 
                        trValues[t.index].iPhone.duration, 
                        trValues[t.index].iPhone.values), 
                        r / 180 % 2 !== 0 ? TweenMax.to(stripe, 0.5, {
                        delay: 0.2,
                        y: 0,
                        scaleX: 1.3,
                        force3D: !0,
                        ease: Sine.easeIn,
                        onComplete: function() {
                            TweenMax.to(stripe, 0, trValues[t.index].stripe.values);
                        }
                    }) : TweenMax.to(stripe, 0.5, {
                        delay: 0.2,
                        y: -wH,
                        scaleX: 1.3,
                        force3D: !0,
                        ease: Sine.easeIn,
                        onComplete: function() {
                            TweenMax.to(stripe, 0, trValues[t.index].stripe.values);
                        }
                    });
                } else  {
                    console.log('else'); 
                }
                TweenMax.to(
                    sliderTitles, 
                    trValues[t.index].sliderTitles.duration, 
                    trValues[t.index].sliderTitles.values
                ),
                //fromTo to expand and contract height of stripe
                TweenMax.to(
                    stripe, 
                    trValues[t.index].stripe.duration, 
                    trValues[t.index].stripe.values
                ), 
                TweenMax.to(
                    iPhone, 
                    trValues[t.index].iPhone.duration, 
                    trValues[t.index].iPhone.values
                ),
                TweenMax.to(
                    largeScreen,
                    trValues[t.index].largeScreen.duration, 
                    trValues[t.index].largeScreen.values
                );
                TweenMax.to(
                    wideContent,
                    trValues[t.index].wideContent.duration, 
                    trValues[t.index].wideContent.values
                );
                TweenMax.to(
                    dayScreens,
                    trValues[t.index].dayScreens.duration, 
                    trValues[t.index].dayScreens.values
                );
                TweenMax.to(timelineCtn, 0.4, {
                    delay: 0,
                    scaleX: 0,
                    force3D: !0,
                    ease: Quad.easeInOut,
                    onComplete: function() {
                        //console.log($body.attr('data-started'),$body.attr('data-forward'),currentSection);
                        setTimeout(function() {
                            if( ($body.attr('data-started') === 'true') && ($body.attr('data-forward') === 'false') && (currentSection === 0)) {
                                console.log('all true');
                                $(document).unbind(mousewheelevt, App.mouseWheelHandler);
                                $body.attr('data-started',false)
                                return;
                            }
                            if( ($body.attr('data-started') === 'false') && ($body.attr('data-forward') === 'true') && (currentSection === 10)) {
                                console.log('all true');
                                $(document).unbind(mousewheelevt, App.mouseWheelHandler);
                                return;
                            }
                        },750);
                        timelineCtn.removeClass('glowing'),
                        TweenMax.to(stripe, 0, trValues[t.index].stripe.returns), 
                        TweenMax.to(timelineCtn, 0, trValues[t.index].timelineCtn.values), 
                        TweenMax.to('#timeline-bar', 0, trValues[t.index].timeline.values), 
                        TweenMax.to(timelineCtn, 0.6, {
                            scaleX: 1,
                            force3D: !0,
                            ease: Quad.easeOut,
                            onComplete: function() {
                                timelineCtn.addClass('glowing');
                            }
                        }), transitionTimer = setTimeout(function() {
                            transitioning = !1;
                        }, 1500), 
                        t.index < sections.length - 1 && wW > 740 && ($(video).unbind('timeupdate'), 
                        setTimeout(function() {
                            sliderTitles.find('h1').text(trValues[t.index].sliderTitles.title);
                            sliderTitles.find('h3 span').text(trValues[t.index].sliderTitles.number);
                            sliderTitles.find('.vertcenter').attr('data-section',currentSection);
                            sliderTitles.find('p span:first-child').text(trValues[t.index].sliderTitles.verticalOne);
                            sliderTitles.find('p span:last-child').text(trValues[t.index].sliderTitles.verticalTwo);
                            video.currentTime = trValues[t.index].video.start, 
                            video.play(), 
                            $(video).bind('timeupdate', function() {
                                this.currentTime >= trValues[t.index].video.end && this.pause();
                            });
                        }, 500));
                    }
                }), 
                setTimeout(function() {
                    //console.log('current classes', t.index);
                    listItems.eq(t.index).addClass('current'), 
                    $('#main-nav li').removeClass('current'), 
                    t.index > 0 && $('#main-nav li').eq(t.index - 1).addClass('current');
                }, n);
            };

        },
        getTransitionValues: function () {
            //step by step animation
            trValues[0] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        backgroundColor:'#4f67e5',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                        
                    },
                    returns: {
                        backgroundColor:'#4f67e5',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                wideContent: {
                    duration: 0,
                    values: {
                        delay: 0.9,
                        y: 0,
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y: 0,
                    },
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        color:'#4f67e5'
                    },
                    title:'AWARENESS',
                    number:'01',
                    verticalOne:'28 DAYS',
                    verticalTwo:'UNTIL THE FINAL'
                },
                iPhone: {
                    duration: 0.5,
                    values: {
                        delay: 0.7,
                        y: 0,
                        rotationZ: -15,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: 0,
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut

                    }
                },
                article: {
                    delay: {
                        forward: 0,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                video: {
                    start: 0,
                    end: 0
                }
            }, 
            trValues[1] = {
                stripe: {
                    duration: 1.3,
                    values: {
                        backgroundColor:'#4f67e5',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut
                    },
                    returns: {
                        backgroundColor:'#4f67e5',
                        delay: 2,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y: 0,
                    },
                },
                wideContent: {
                    duration: 0,
                    values: {
                        delay: 0.9,
                        y: 0,
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#4f67e5'}
                    },
                    title:'AWARENESS',
                    number:'01',
                    verticalOne:'28 DAYS',
                    verticalTwo:'UNTIL THE FINAL'
                },
                iPhone: {
                    duration: 0.8,
                    values: {
                        delay: 0.3,
                        y: iPhoneTransVal+20,
                        rotationZ: 0,
                        force3D: !0,
                        ease: Sine.easeInOut
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        //changed to large screen transval
                        y: largeScreenTransVal-274,
                        rotationZ: -30,
                        force3D: !0,
                        ease: Quad.easeInOut

                    }
                },
                article: {
                    delay: {
                        forward: 600,
                        backward: 600
                    }
                },
                timelineCtn: {
                    duration: 0.8,
                    values: {
                        delay: 0.2,
                        y: 130,
                        rotationZ: 0,
                        opacity: 1,
                        force3D: !0,
                        ease: Quint.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '25%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                video: {
                    start: 0,
                    end: 30
                }
            }, 
            trValues[2] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        backgroundColor:'#4f67e5',top:0,height:5000,
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        css:{backgroundColor:'#ff5745',top:'60%'},
                        delay: 1,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y: 0,
                    },
                },
                wideContent: {
                    duration: 0,
                    values: {
                        delay: 0.9,
                        y: 0,
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#ff5745'},
                        delay:1
                    },
                    title:'EXCITE',
                    number:'02',
                    verticalOne:'14 DAYS',
                    verticalTwo:'UNTIL THE FINAL'
                },
                iPhone: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: 0,
                        rotationZ: -15,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        rotationZ: 0,
                        y: 0,
                        force3D: !0,
                        ease: Quad.easeInOut

                    }
                },
                article: {
                    delay: {
                        forward: 600,
                        backward: 600
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: -150,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '50%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                video: {
                    start: 11,
                    end: 23
                }
            }, 
            trValues[3] = {
                stripe: {
                    duration: 1.3,
                    values: {
                        backgroundColor:'#ff5745',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        backgroundColor:'#ff5745',
                        delay: 1,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y: 0,
                    },
                },
                wideContent: {
                    duration: 0,
                    values: {
                        delay: 0.9,
                        y: '0%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#ff5745'}
                    },
                    title:'EXCITE',
                    number:'02',
                    verticalOne:'14 DAYS',
                    verticalTwo:'UNTIL THE FINAL'
                },
                iPhone: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        rotationZ: 0,
                        y: iPhoneTransVal+20,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: largeScreenTransVal-74,
                        force3D: !0,
                        ease: Quad.easeInOut

                    }
                },
                article: {
                    delay: {
                        forward: 600,
                        backward: 600
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 130,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '75%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                video: {
                    start: 23,
                    end: 27.5
                }
            }, 
            trValues[4] = {
                stripe: {
                    duration: 1.3,
                    values: {
                        backgroundColor:'#ff5745',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        backgroundColor:'#ff5745',
                        delay: 2,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y: 0,
                    },
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: '0%',
                        rotationZ: -45,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#ff5745'}
                    },
                    title:'EXCITE',
                    number:'02',
                    verticalOne:'14 DAYS',
                    verticalTwo:'UNTIL THE FINAL'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: iPhoneTransVal+20,
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeOut
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: iPhoneTransVal,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 600,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        opacity: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                video: {
                    start: 27.5,
                    end: video.duration
                }
            }, 
            trValues[5] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        backgroundColor:'#ff5745',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        backgroundColor:'#ff5745',
                        delay: 2,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },

                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y: 0,
                    },
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y:'174%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#ff3b20'}
                    },
                    title:'EXCITE',
                    number:'02',
                    verticalOne:'14 DAYS',
                    verticalTwo:'UNTIL THE FINAL'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: 2 * -wH,
                        rotationZ: 15,
                        force3D: !0,
                        ease: Sine.easeIn
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: iPhoneTransVal,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 0,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        scaleX: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                }
            },
            trValues[6] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        backgroundColor:'#ff5745',
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        backgroundColor:'#ff5745',
                        delay: 2,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y:'174%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y: '0%'
                    },
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        color:'#ff3b20'
                    },
                    title:'EXCITE',
                    number:'02',
                    verticalOne:'14 DAYS',
                    verticalTwo:'UNTIL THE FINAL'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: 2 * -wH,
                        rotationZ: 15,
                        force3D: !0,
                        ease: Sine.easeIn
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: iPhoneTransVal,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 0,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        scaleX: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                }
            },
            trValues[7] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        backgroundColor:'#43db84',top:0,height:5000,
                        delay: 0,
                        y:0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        backgroundColor:'#43db84',top:'60%',
                        delay: 1,
                        y:0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'214%'
                    },
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y:'0%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        color:'#43db84'
                    },
                    title:'ACTIVATE',
                    number:'03',
                    verticalOne:'EVENT',
                    verticalTwo:'DAY'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: 2 * -wH,
                        rotationZ: 15,
                        force3D: !0,
                        ease: Sine.easeIn
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: iPhoneTransVal,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 2,
                        backward: 2
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        scaleX: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                }
            },
            trValues[8] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        backgroundColor:'#7543db',top:0,height:5000,
                        delay: 0,
                        y: 0,
                        rotationZ: 0,
                        scaleY: 5,
                        force3D: !0,
                        ease: Quad.easeInOut,
                    },
                    returns: {                        
                        backgroundColor:'#7543db',
                        top:'60%',
                        delay: 1,
                        y: 0,
                        rotationZ: 0,
                        scaleX: 1,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                dayScreens: {
                    duration: 0.9,
                    values: {
                        delay: 0.9,
                        y:'0%'
                    }
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y:'174%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        css:{color:'#7543db'},
                        delay:1
                    },
                    title:'POST-EVENT',
                    number:'04',
                    verticalOne:'POST',
                    verticalTwo:'EVENT'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: 2 * -wH,
                        rotationZ: 15,
                        force3D: !0,
                        ease: Sine.easeIn
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: iPhoneTransVal,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 0,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        scaleX: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                }
            },
            trValues[9] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        delay: 0.2,
                        y:0,
                        rotationZ: 0,
                        force3D: !0,
                        ease: Sine.easeIn,
                        backgroundColor:'#7543db'
                    }
                },
                dayScreens: {
                    duration: 0,
                    values: {
                        y: 0,
                    },
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y:'174%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        color:'#7543db'
                    },
                    title:'POST-EVENT',
                    number:'04',
                    verticalOne:'POST',
                    verticalTwo:'EVENT'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: 2 * -wH,
                        rotationZ: 15,
                        force3D: !0,
                        ease: Sine.easeIn
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: iPhoneTransVal,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 0,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        scaleX: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                }
            },
            trValues[10] = {
                stripe: {
                    duration: 0.5,
                    values: {
                        delay: 0.2,
                        y:0,
                        rotationZ: 0,
                        force3D: !0,
                        ease: Sine.easeIn,
                        backgroundColor:'#7543db'
                    }
                },
                dayScreens: {
                    duration: 0,
                    values: {
                        y:'0%',
                    },
                },
                wideContent: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y:'174%',
                        rotationZ: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                sliderTitles: {
                    duration: 0.5,
                    values: {
                        color:'#7543db'
                    },
                    title:'POST-EVENT',
                    number:'04',
                    verticalOne:'POST',
                    verticalTwo:'EVENT'
                },
                iPhone: {
                    duration: 0.7,
                    values: {
                        delay: 0,
                        y: 2 * -wH,
                        rotationZ: 15,
                        force3D: !0,
                        ease: Sine.easeIn
                    }
                },
                largeScreen: {
                    duration: 0.8,
                    values: {
                        delay: 0.9,
                        y: iPhoneTransVal,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                article: {
                    delay: {
                        forward: 0,
                        backward: 0
                    }
                },
                timelineCtn: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        y: 0,
                        scaleX: 0,
                        opacity: 0,
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                },
                timeline: {
                    duration: 0.5,
                    values: {
                        delay: 0,
                        x: '100%',
                        force3D: !0,
                        ease: Quad.easeInOut
                    }
                }
            };
        },
        TabletScroll: function() {
            this.init = function() {
                touchmoveDisabled = !0, $(document).on('touchend', App.initiPadVideo), 
                $(document).swipe({
                    threshold: 100,
                    allowPageScroll: 'none',
                    swipeUp: function() {
                        !transitioning && currentSection < sections.length - 1 && (transitioning = !0, currentSection++, forward = !0, sections[currentSection].animate(forward));
                    },
                    swipeDown: function() {
                        !transitioning && currentSection > 0 && (transitioning = !0, currentSection--, forward = !1, sections[currentSection].animate(forward));
                    }
                });
            }, this.kill = function() {
                touchmoveDisabled = !1, 
                $(document).swipe('destroy');
            };

        },
        rotateSlide: function(e, t) {
            var i, n = lastSwipeProgress - t,
                r = n * (slidesNumber - 1),
                s = $('#slider-images span').eq(e.activeIndex),
                a = $('#slider-images span').eq(0 > n ? e.activeIndex + 1 : e.activeIndex - 1),
                o = Math.min(90, 90 * r);
            r >= 0 ? i = Math.max(-90, -90 + 90 * r) : 0 > r && (i = Math.min(90, 90 - -90 * r)), 
            s.css({
                transform: 'rotate(' + o + 'deg)'
            }), 
            a.css({
                transform: 'rotate(' + i + 'deg)'
            }), 
            lastViableProgress = t;
        }


	};




})(jQuery, window, document);
