import React from 'react'
import { useEffect } from 'react';
import { Link } from 'react-router';

const GallerySection = () => {

    useEffect(() => {
        if (window.$ && window.$.fn) {
            const $ = window.$;

            $('.set-bg').each(function () {
            var bg = $(this).data('setbg');
            $(this).css('background-image', 'url(' + bg + ')');
            });
        }
    }, []);
    
  return (
    <div style={{ paddingTop: "60px" }}>
        <div class="breadcrumb-section">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="breadcrumb-text">
                            <h2>Gallery</h2>
                            <div class="bt-option">
                                <Link to="/">Home</Link>
                                <span>Gallery Grid</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="blog-section blog-page spad">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4 col-md-6">
                        <div class="blog-item set-bg" data-setbg="img/blog/blog-1.jpg"></div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="blog-item set-bg" data-setbg="img/blog/blog-2.jpg"></div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="blog-item set-bg" data-setbg="img/blog/blog-3.jpg"></div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="blog-item set-bg" data-setbg="img/blog/blog-4.jpg"></div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="blog-item set-bg" data-setbg="img/blog/blog-5.jpg"></div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="blog-item set-bg" data-setbg="img/blog/blog-6.jpg"></div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="blog-item set-bg" data-setbg="img/blog/blog-7.jpg"></div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="blog-item set-bg" data-setbg="img/blog/blog-8.jpg"></div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="blog-item set-bg" data-setbg="img/blog/blog-9.jpg"></div>
                    </div>
                    <div class="col-lg-12">
                        <div class="load-more">
                            <a href="#" class="primary-btn">Load More</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default GallerySection;
