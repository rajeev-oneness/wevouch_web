(function ($, window, Typist) {
    	
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

        /*-------------Right-part-------------*/

        $(document).on('click', '.schedthis', function(){
            var show =  $(this).val() === 'Show';
                        $(this).val(show ? 'Hide' : 'Show');
            $('#schedbox').toggle('slide',{ direction: 'right' }, 1500);
        });

        /**********product_detail************/

        const imgs = document.querySelectorAll('.img-select a');
        const imgBtns = [...imgs];
        let imgId = 1;

        imgBtns.forEach((imgItem) => {
            imgItem.addEventListener('click', (event) => {
                event.preventDefault();
                imgId = imgItem.dataset.id;
                slideImage();
            });
        });

        function slideImage(){
            const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;

            document.querySelector('.img-showcase').style.transform = `translateX(${- (imgId - 1) * displayWidth}px)`;
        }

        window.addEventListener('resize', slideImage);
    


})(jQuery, window);