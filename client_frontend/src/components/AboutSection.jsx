import React from 'react'
import { useEffect } from 'react';
import { Link } from 'react-router';

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
        <div style={{ paddingTop: "60px" }}>
            <div class="breadcrumb-section">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="breadcrumb-text">
                            <h2>About Us</h2>
                            <div class="bt-option">
                                <Link to="/">Home</Link>
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
                                <h2>Welcome To Nature Life Guest</h2>
                                <p>Ella Nature Life Guest & Restaurant offers a peaceful stay surrounded by Ella’s 
                                    natural beauty. Rooms include modern amenities like a dishwasher, toaster, coffee machine,
                                     and private bathroom with toiletries and a hairdryer. Some rooms feature balconies with 
                                     scenic views. Guests can enjoy buffet, à la carte, or continental breakfasts, and the 
                                     restaurant serves African, American, and Chinese dishes with vegetarian, dairy-free, 
                                     and halal options. The property provides bike and car rentals for exploring nearby 
                                     attractions such as Ella Spice Garden (3.9 km) and Little Adam’s Peak (5.9 km).</p>
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
                            <div class="ap-service-item set-bg" data-setbg="img/about/about-p1.jpg" >
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
