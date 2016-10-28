require('../../_shared/js/bootstrap');
// require('../../_shared/js/components');

import config from './config'

import layout from './widgets/layout'
import pushMenu from './widgets/push-menu'
import sidebar from './widgets/sidebar'
import controlSidebar from './widgets/control-sidebar'
import boxWidget from './widgets/box-widget'

import todoList from './plugins/todo-list'

$.App = {
    widgets: {
        layout,
        pushMenu,
        sidebar,
        controlSidebar,
        boxWidget
    }
};

const app = new Vue({
    el: '#app',
    data: {
        widgets: $.App.widgets
    },
    mounted() {
        $(() => {
            // Fix for IE page transitions
            $('body').removeClass('hold-transition');

            $.App.options = config;

            // Extend options if external options exist
            if (typeof AppOptions !== 'undefined') {
                $.extend(true, $.App.options, AppOptions);
            }

            this.init()
        });
    },
    methods: {
        init() {
            let options = $.App.options;

            this.widgets.layout.activate();

            // Enable sidebar tree view controls
            this.widgets.sidebar.activate(this.widgets.layout, '.sidebar');

            // Enable control sidebar
            if (options.sidebar.controlOptions.enabled)
                this.widgets.controlSidebar.activate();

            // Add slimscroll to navbar dropdown
            if (options.navbar.menu.slimScroll.enabled && typeof $.fn.slimscroll != 'undefined')
                $('.navbar .menu').slimscroll({
                    alwaysVisible: false,
                    height: options.navbar.menu.slimScroll.height,
                    size: options.navbar.menu.slimScroll.width
                }).css('width', '100%');

            // Activate sidebar push menu
            if (options.sidebar.pushMenu)
                this.widgets.pushMenu.activate(options.sidebar.toggleSelector);

            // Activate Bootstrap tooltip
            if (options.bootstrap.tooltip.enabled)
                $('body').tooltip({
                    selector: options.bootstrap.tooltip.selector
                });

            // Activate box widget
            if (options.boxWidget.enabled)
                this.widgets.boxWidget.activate();

            // Activate fast click
            if (options.fastClick.enabled && typeof FastClick != 'undefined')
                FastClick.attach(document.body);

            // Activate direct chat widget
            if (options.directChat.enabled)
                $(document).on('click', options.directChat.contactToggleSelector, (e) => {
                    let box = $(e.target).parents('.direct-chat').first();

                    box.toggleClass('direct-chat-contacts-open');
                });

            /*
             * INITIALIZE BUTTON TOGGLE
             * ------------------------
             */
            $('.btn-group[data-toggle="btn-toggle"]').each((e) => {
                var group = $(e.target);

                group.find('.btn').on('click', function (e) {
                    e.preventDefault();
                    group.find('.btn.active').removeClass('active');
                    $(e.target).addClass('active');
                });
            });

            /*
             * User menu animation
             * -----------------------
             */
            let userMenu     = $('.dropdown.user.user-menu'),
                userDropMenu = userMenu.find('.dropdown-menu');

            userDropMenu.addClass('animated');

            userMenu.on('show.bs.dropdown', () => {
                userDropMenu.addClass('flipInY')
            });

            userMenu.on('hide.bs.dropdown', () => {
                userDropMenu.removeClass('flipInY')
            })
        }
    }
});

/* ------------------
 * - Custom Plugins -
 * ------------------
 * All custom plugins are defined below.
 */
$(() => {
    /*
     * BOX REFRESH BUTTON
     * ------------------
     * This is a custom plugin to use with the component BOX. It allows you to add
     * a refresh button to the box. It converts the box's state to a loading state.
     *
     * @type plugin
     * @usage $("#box-widget").boxRefresh( options );
     */
    $.fn.boxRefresh = (options) => {
        // Render options
        var settings = $.extend({
            // Refresh button selector
            trigger: '.refresh-btn',
            // File source to be loaded (e.g: ajax/src.php)
            source: '',
            // Callbacks
            onLoadStart(box) {
                return box;
            },
            // Right after the button has been clicked
            onLoadDone(box) {
                return box;
            }
            // When the source has been loaded
        }, options);

        // The overlay
        var overlay = $('<div class="overlay"><div class="fa fa-refresh fa-spin"></div></div>');

        return this.each(function () {
            // if a source is specified
            if (settings.source === '') {
                if (window.console) {
                    window.console.log('Please specify a source first - boxRefresh()');
                }

                return;
            }

            // the box
            var box  = $(this),
                rBtn = box.find(settings.trigger).first(); // the Button

            // On trigger click
            rBtn.on('click', (e) => {
                e.preventDefault();
                // Add loading overlay
                start(box);

                // Perform ajax call
                box.find('.box-body').load(settings.source, () => done(box));
            });
        });

        function start(box) {
            // Add overlay and loading img
            box.append(overlay);

            settings.onLoadStart.call(box);
        }

        function done(box) {
            // Remove overlay and loading img
            box.find(overlay).remove();

            settings.onLoadDone.call(box);
        }
    };

    /*
     * EXPLICIT BOX CONTROLS
     * -----------------------
     * This is a custom plugin to use with the component BOX. It allows you to activate
     * a box inserted in the DOM after the app.js was loaded, toggle and remove box.
     *
     * @type plugin
     * @usage $("#box-widget").activateBox();
     * @usage $("#box-widget").toggleBox();
     * @usage $("#box-widget").removeBox();
     */
    $.fn.activateBox = () => {
        $.App.widgets.boxWidget.activate(this);
    };

    $.fn.toggleBox = () => {
        let button = $($.App.boxWidget.selectors.collapse, this);
        $.App.widgets.boxWidget.collapse(button);
    };

    $.fn.removeBox = () => {
        let button = $($.App.boxWidget.selectors.remove, this);
        $.App.widgets.boxWidget.remove(button);
    };

    /*
     * TODO LIST CUSTOM PLUGIN
     * -----------------------
     * This plugin depends on iCheck plugin for checkbox and radio inputs
     *
     * @type plugin
     * @usage $("#todo-widget").todolist( options );
     */
    $.fn.todolist = todoList;
});
