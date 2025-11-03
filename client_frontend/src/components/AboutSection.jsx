import React from 'react'
import { useEffect } from 'react';

const AboutSection = () => {

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
        <div>
            <div class="breadcrumb-section">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="breadcrumb-text">
                            <h2>About Us</h2>
                            <div class="bt-option">
                                <a href="./index.html">Home</a>
                                <span>About Us</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="aboutus-page-section spad">
            <div class="container">
                <div class="about-page-text">
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="ap-title">
                                <h2>Welcome To Sona.</h2>
                                <p>Built in 1910 during the Belle Epoque period, this hotel is located in the center of
                                    Paris, with easy access to the city’s tourist attractions. It offers tastefully
                                    decorated rooms.</p>
                            </div>
                        </div>
                        <div class="col-lg-5 offset-lg-1">
                            <ul class="ap-services">
                                <li><i class="icon_check"></i> 20% Off On Accommodation.</li>
                                <li><i class="icon_check"></i> Complimentary Daily Breakfast</li>
                                <li><i class="icon_check"></i> 3 Pcs Laundry Per Day</li>
                                <li><i class="icon_check"></i> Free Wifi.</li>
                                <li><i class="icon_check"></i> Discount 20% On F&B</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="about-page-services">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="ap-service-item set-bg" data-setbg="img/about/about-p1.jpg">
                                <div class="api-text">
                                    <h3>Restaurants Services</h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="ap-service-item set-bg" data-setbg="img/about/about-p2.jpg">
                                <div class="api-text">
                                    <h3>Travel & Camping</h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="ap-service-item set-bg" data-setbg="img/about/about-p3.jpg">
                                <div class="api-text">
                                    <h3>Event & Party</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        </div>
    )
}

export default AboutSection;
