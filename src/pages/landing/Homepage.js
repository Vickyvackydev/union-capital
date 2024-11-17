import React from "react";


import logo from "../../assets/images/logo.png"
import coin from "../../assets/images/referral/coin.png"
import drop from "../../assets/images/referral/drop.png"
import thumb2 from "../../assets/images/referral/thumb2.png"



export function Homepage() {
    return (
        <div>
            <div className="preloader">
                <div className="preinner">
                    <div className="ring"></div>
                    <div className="ring"></div>
                    <div className="ring"></div>
                </div>
            </div>
            <div className="overlay"></div>

            <header className="header">
                <div className="header-bottom pt-lg-5">
                    <div className="container">
                        <div className="header-bottom-area">
                            <div className="logo">
                                <a href="/"><img src={logo} alt="Union Guard Capital Logo" style={{ objectFit: "cover" }} /></a>
                            </div>
                            <ul className="menu">
                                <li><a href="index.html">Home</a></li>
                                <li><a href="about.html">About</a></li>
                                <li><a href="plan.html">Plan</a></li>
                                <li><a href="contact.html">Contact</a></li>
                            </ul>

                            <div className="header-trigger-wrapper d-flex d-lg-none align-items-center">
                                <div className="mobile-nav-right d-flex align-items-center"></div>
                                <a href="#0" className="search--btn me-4 text--base"><i className="fas fa-search"></i></a>
                                <div className="header-trigger d-block d--none">
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="banner-section banner-two overflow-hidden bg_img" style={{ background: "url(./assets/images/banner/banner-bg2.png) center", height: "100vh" }}>
                <div className="container">
                    <div className="banner__content mx-100 text-center padding-top padding-bottom" style={{ paddingTop: "-55px" }}>
                        <h1 className="title">Grow Your Wealth with Union Guard Capital</h1>
                        <p className="mx-auto text-white" style={{ maxWidth: "850px", width: "80%", margin: "15px auto" }}>
                            At Union Guard Capital, we provide secure and strategic investment options tailored to help you achieve financial freedom. Whether you're looking to protect your assets or grow your portfolio, we’ve got you covered.
                        </p>
                        <a href="/invest/schemes" className="cmn--btn">Invest Now</a>
                    </div>
                </div>
            </section>

            <section className="padding-bottom" style={{ marginTop: "300px" }}>
                <div className="container">
                    <div className="row" style={{ zIndex: 500 }}>
                        <div className="">
                            <h2 style={{ color: "#fff", textAlign: "center" }}>Let’s Go for Investment & Get Your Profit</h2>
                            <p style={{ color: "#fff", textAlign: "center" }}>
                                Start investing today with our wide range of options, designed to deliver consistent and reliable returns. From low-risk strategies to growth-focused investments, Union Guard Capital helps you build lasting wealth.
                            </p>
                            <a href="/auth-register" className="cmn--btn4 mt-4" style={{ display: "block", width: "fit-content", margin: "50px auto" }}>Register</a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="referral-section padding-bottom">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 align-self-end d-none d-lg-block">
                            <div className="section__thumb rtl me-5">
                                <img src={thumb2} alt="Referral Program" />
                                <div className="shapes">
                                    <img src={coin} alt="Coin Shape" className="shape shape3" />
                                    <img src={drop} alt="Drop Shape" className="shape shape4" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="section__header">
                                <h2 className="section__header-title">Earn an *extra 5%* through our Referral Program!</h2>
                                <p>Share Union Guard Capital with your friends, and get rewarded for helping them secure their future.</p>
                            </div>
                            <a href="/invest" className="cmn--btn4">Get Started</a>
                        </div>
                    </div>
                </div>
            </section>

            <div style={{ height: "50px", width: "100%" }}></div>

            <section>
                <div className="container">
                    <p style={{ textAlign: "center", color: "#fff", fontSize: "2.5rem", fontWeight: "bold" }}>
                        Your money should work for you! Invest with Union Guard Capital and start earning more today.
                    </p>
                    <a href="https://dashboard.unionguardcapital.com" className="cmn--btn4" style={{ display: "block", margin: "0 auto", width: "fit-content" }}>Invest Now</a>
                </div>
            </section>

            <div style={{ height: "150px", width: "100%" }}></div>

            <footer className="footer-section style--two">
                <p style={{ textAlign: "center", color: "#fff", fontSize: "1.5rem", width: "80%", margin: "0 auto", fontWeight: "bold" }}>
                    Join thousands of satisfied clients who trust Union Guard Capital to safeguard and grow their assets. Terms and conditions apply.
                </p>
                <div className="footer-bottom">
                    <div className="container">
                        <p className="copyright text-center py-3">
                            Copyright &copy; Unionguardcapital 2024 All Rights Reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}