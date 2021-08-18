(function ($, window, Typist) {
    	// let click = document.querySelector('.dropdown-button');

        //     let list = document.querySelector('.list');

        //     click.addEventListener("click",()=>{

        //         list.classList.toggle('toggle-list');

        //     });

        //     let click2 = document.querySelector('.dropdown-button-second');

        //     let list2 = document.querySelector('.list2');

        //     click2.addEventListener("click",()=>{

        //         list2.classList.toggle('toggle-list');

        //     });
        //     let mobMenuButton = document.querySelector('.toggle-mob-menu');

        //     let mobMenu = document.querySelector('.menu');
        //     let menuButton = document.querySelector('.menu-button');

        //     mobMenuButton.addEventListener("click",()=>{

        //         mobMenu.classList.toggle('mob-menu');
        //         menuButton.classList.toggle('fa-chevron-down');

        //     });

        /*--------------left_panel_colaps----------------*/

        $(document).ready(function () {
            $("#sidebar").mCustomScrollbar({
                theme: "minimal"
            });

            $('#sidebarCollapse').on('click', function () {
                $('#sidebar, #content').toggleClass('active');
                $('.collapse.in').toggleClass('in');
                $('a[aria-expanded=true]').attr('aria-expanded', 'false');
            });
        });

        /*----------------expand-div------------------*/

        $(function() {
            var b = $("#button");
            var w = $("#wrapper");
            var l = $("#list");
            b.click(function() {
                w.toggleClass('open'); /* <-- toggle the application of the open class on click */
            });
        });

})(jQuery, window);