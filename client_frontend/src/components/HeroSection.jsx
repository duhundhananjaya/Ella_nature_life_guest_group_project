import React, { useEffect } from 'react';

const HeroSection = () => {

  useEffect(() => {

    if (window.$ && window.$.fn) {
        const $ = window.$;

        $('.set-bg').each(function () {
            var bg = $(this).data('setbg');
            $(this).css('background-image', 'url(' + bg + ')');
        });

        if ($.fn.owlCarousel) {
            $(".hero-slider").owlCarousel({
            loop: true,
            margin: 0,
            items: 1,
            dots: true,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            smartSpeed: 1200,
            autoHeight: false,
            autoplay: true,
            mouseDrag: false
            });

            $(".testimonial-slider").owlCarousel({
            items: 1,
            dots: false,
            autoplay: true,
            loop: true,
            smartSpeed: 1200,
            nav: true,
            navText: ["<i class='arrow_left'></i>", "<i class='arrow_right'></i>"]
            });
        }

        if ($.fn.datepicker) {
            $(".date-input").datepicker({
            minDate: 0,
            dateFormat: 'dd MM, yy'
            });
        }

        if ($.fn.niceSelect) {
            $("select").niceSelect();
        }


        return () => {
            if ($.fn.owlCarousel) {
            $(".hero-slider").trigger('destroy.owl.carousel');
            $(".testimonial-slider").trigger('destroy.owl.carousel');
            }
            if ($.fn.niceSelect) {
            $("select").niceSelect('destroy');
            }
        };
        }
    }, []);

  return (
    <div>       
      <section className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="hero-text">
                <h1>Ella Nature Life Guest</h1>
                <p>Here are the best hotel booking sites, including recommendations for international
                  travel and for finding low-priced hotel rooms.</p>
                <a href="#" className="primary-btn">Discover Now</a>
              </div>
            </div>
            <div className="col-xl-4 col-lg-5 offset-xl-2 offset-lg-1">
              <div className="booking-form">
                <h3>Booking Your Hotel</h3>
                <form action="#">
                  <div className="check-date">
                    <label htmlFor="date-in">Check In:</label>
                    <input type="text" className="date-input" id="date-in" />
                    <i className="icon_calendar"></i>
                  </div>
                  <div className="check-date">
                    <label htmlFor="date-out">Check Out:</label>
                    <input type="text" className="date-input" id="date-out" />
                    <i className="icon_calendar"></i>
                  </div>
                  <div className="select-option">
                    <label htmlFor="guest">Guests:</label>
                    <select id="guest">
                      <option value="">2 Adults</option>
                      <option value="">3 Adults</option>
                    </select>
                  </div>
                  <div className="select-option">
                    <label htmlFor="room">Room:</label>
                    <select id="room">
                      <option value="">1 Room</option>
                      <option value="">2 Room</option>
                    </select>
                  </div>
                  <button type="submit">Check Availability</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-slider owl-carousel">
          <div className="hs-item set-bg" data-setbg="img/hero/hero-1.jpg"></div>
          <div className="hs-item set-bg" data-setbg="img/hero/hero-2.jpg"></div>
          <div className="hs-item set-bg" data-setbg="img/hero/hero-3.jpg"></div>
        </div>
      </section>

      <section className="aboutus-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="about-text">
                <div className="section-title">
                  <span>About Us</span>
                  <h2>Intercontinental LA <br />Westlake Hotel</h2>
                </div>
                <p className="f-para">Sona.com is a leading online accommodation site. We're passionate about
                  travel. Every day, we inspire and reach millions of travelers across 90 local websites in 41
                  languages.</p>
                <p className="s-para">So when it comes to booking the perfect hotel, vacation rental, resort,
                  apartment, guest house, or tree house, we've got you covered.</p>
                <a href="#" className="primary-btn about-btn">Read More</a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-pic">
                <div className="row">
                  <div className="col-sm-6">
                    <img src="img/about/about-1.jpg" alt="" />
                  </div>
                  <div className="col-sm-6">
                    <img src="img/about/about-2.jpg" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <span>What We Do</span>
                <h2>Discover Our Services</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-sm-6">
              <div className="service-item">
                <i className="flaticon-036-parking"></i>
                <h4>Travel Plan</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna.</p>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="service-item">
                <i className="flaticon-033-dinner"></i>
                <h4>Catering Service</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna.</p>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="service-item">
                <i className="flaticon-026-bed"></i>
                <h4>Babysitting</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna.</p>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="service-item">
                <i className="flaticon-024-towel"></i>
                <h4>Laundry</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna.</p>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="service-item">
                <i className="flaticon-044-clock-1"></i>
                <h4>Hire Driver</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna.</p>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="service-item">
                <i className="flaticon-012-cocktail"></i>
                <h4>Bar & Drink</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-room-section">
        <div className="container-fluid">
          <div className="hp-room-items">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="hp-room-item set-bg" data-setbg="img/room/room-b1.jpg">
                  <div className="hr-text">
                    <h3>Double Room</h3>
                    <h2>199$<span>/Pernight</span></h2>
                    <table>
                      <tbody>
                        <tr>
                          <td className="r-o">Size:</td>
                          <td>30 ft</td>
                        </tr>
                        <tr>
                          <td className="r-o">Capacity:</td>
                          <td>Max persion 5</td>
                        </tr>
                        <tr>
                          <td className="r-o">Bed:</td>
                          <td>King Beds</td>
                        </tr>
                        <tr>
                          <td className="r-o">Services:</td>
                          <td>Wifi, Television, Bathroom,...</td>
                        </tr>
                      </tbody>
                    </table>
                    <a href="#" className="primary-btn">More Details</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="hp-room-item set-bg" data-setbg="img/room/room-b2.jpg">
                  <div className="hr-text">
                    <h3>Premium King Room</h3>
                    <h2>159$<span>/Pernight</span></h2>
                    <table>
                      <tbody>
                        <tr>
                          <td className="r-o">Size:</td>
                          <td>30 ft</td>
                        </tr>
                        <tr>
                          <td className="r-o">Capacity:</td>
                          <td>Max persion 5</td>
                        </tr>
                        <tr>
                          <td className="r-o">Bed:</td>
                          <td>King Beds</td>
                        </tr>
                        <tr>
                          <td className="r-o">Services:</td>
                          <td>Wifi, Television, Bathroom,...</td>
                        </tr>
                      </tbody>
                    </table>
                    <a href="#" className="primary-btn">More Details</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="hp-room-item set-bg" data-setbg="img/room/room-b3.jpg">
                  <div className="hr-text">
                    <h3>Deluxe Room</h3>
                    <h2>198$<span>/Pernight</span></h2>
                    <table>
                      <tbody>
                        <tr>
                          <td className="r-o">Size:</td>
                          <td>30 ft</td>
                        </tr>
                        <tr>
                          <td className="r-o">Capacity:</td>
                          <td>Max persion 5</td>
                        </tr>
                        <tr>
                          <td className="r-o">Bed:</td>
                          <td>King Beds</td>
                        </tr>
                        <tr>
                          <td className="r-o">Services:</td>
                          <td>Wifi, Television, Bathroom,...</td>
                        </tr>
                      </tbody>
                    </table>
                    <a href="#" className="primary-btn">More Details</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="hp-room-item set-bg" data-setbg="img/room/room-b4.jpg">
                  <div className="hr-text">
                    <h3>Family Room</h3>
                    <h2>299$<span>/Pernight</span></h2>
                    <table>
                      <tbody>
                        <tr>
                          <td className="r-o">Size:</td>
                          <td>30 ft</td>
                        </tr>
                        <tr>
                          <td className="r-o">Capacity:</td>
                          <td>Max persion 5</td>
                        </tr>
                        <tr>
                          <td className="r-o">Bed:</td>
                          <td>King Beds</td>
                        </tr>
                        <tr>
                          <td className="r-o">Services:</td>
                          <td>Wifi, Television, Bathroom,...</td>
                        </tr>
                      </tbody>
                    </table>
                    <a href="#" className="primary-btn">More Details</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonial-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <span>Testimonials</span>
                <h2>What Customers Say?</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="testimonial-slider owl-carousel">
                <div className="ts-item">
                  <p>After a construction project took longer than expected, my husband, my daughter and I
                    needed a place to stay for a few nights. As a Chicago resident, we know a lot about our
                    city, neighborhood and the types of housing options available and absolutely love our
                    vacation at Sona Hotel.</p>
                  <div className="ti-author">
                    <div className="rating">
                      <i className="icon_star"></i>
                      <i className="icon_star"></i>
                      <i className="icon_star"></i>
                      <i className="icon_star"></i>
                      <i className="icon_star-half_alt"></i>
                    </div>
                    <h5> - Alexander Vasquez</h5>
                  </div>
                  <img src="img/testimonial-logo.png" alt="" />
                </div>
                <div className="ts-item">
                  <p>After a construction project took longer than expected, my husband, my daughter and I
                    needed a place to stay for a few nights. As a Chicago resident, we know a lot about our
                    city, neighborhood and the types of housing options available and absolutely love our
                    vacation at Sona Hotel.</p>
                  <div className="ti-author">
                    <div className="rating">
                      <i className="icon_star"></i>
                      <i className="icon_star"></i>
                      <i className="icon_star"></i>
                      <i className="icon_star"></i>
                      <i className="icon_star-half_alt"></i>
                    </div>
                    <h5> - Alexander Vasquez</h5>
                  </div>
                  <img src="img/testimonial-logo.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;