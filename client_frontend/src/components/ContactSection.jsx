import React from "react";

const ContactSection = () => {

    return (
        <div style={{ paddingTop: "60px" }}>
        <section className="contact-section spad">
        <div className="container">
            <div className="row">
            <div className="col-lg-4">
                <div className="contact-text">
                <h2>Contact Info</h2>
                <p>
                    Set in Ella, 7.2 km from Demodara Nine Arch Bridge.
                    The property is around 45 km from Hakgala Botanical Garden, 
                    46 km from Horton Plains National Park and 3.5 km from Ella Railway Station.
                </p>
                <table>
                    <tbody>
                    <tr>
                        <td className="c-o">Address:</td>
                        <td>Kitelella Road Ella, 90090 Ella, Sri Lanka.</td>
                    </tr>
                    <tr>
                        <td className="c-o">Phone:</td>
                        <td>+94 774749061</td>
                    </tr>
                    <tr>
                        <td className="c-o">Email:</td>
                        <td>saliyadineshka@gmail.com</td>
                    </tr>
                    <tr>
                        <td className="c-o">Fax:</td>
                        <td>+94 753728582</td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7 offset-lg-1">
                <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                    <div className="col-lg-6">
                    <input type="text" placeholder="Your Name" required />
                    </div>
                    <div className="col-lg-6">
                    <input type="email" placeholder="Your Email" required />
                    </div>
                    <div className="col-lg-12">
                    <textarea placeholder="Your Message" required></textarea>
                    <button type="submit" className="site-btn">
                        Submit Now
                    </button>
                    </div>
                </div>
                </form>
            </div>
            </div>

            {/* Google Map */}
            <div className="map mt-5">
            <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.6962139240187!2d81.037793!3d6.858109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae4653b2d49906b%3A0xfc6addf36bc29df!2sElla%20Nature%20Life%20Guest%20and%20Restaurant!5e0!3m2!1sen!2slk!4v1731060000000!5m2!1sen!2slk"
                height="470"
                style={{ border: 0, width: "100%" }}
                allowFullScreen
                loading="lazy"
            ></iframe>
            </div>
        </div>
        </section>
        </div>
    );
};

export default ContactSection;
