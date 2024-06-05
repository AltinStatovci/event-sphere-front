    <script setup>
    import { useRouter } from "vue-router";
    const router = useRouter();

    const onContact = () => {
        router.push({ path: '/contact' });
    }
</script>
<template>
    <div class="bg-image flex-fill"
        style="background-image: url('https://en.idei.club/uploads/posts/2023-06/1686948162_en-idei-club-p-business-office-background-dizain-instagra-1.jpg'); height: 50vh; position: relative;">
        <!-- Mask for shading -->
        <div class="mask"
            style="background-color: rgba(0, 0, 0, 0.6); height: 100%; width: 100%; position: absolute; top: 0; left: 0;">
            <!-- Text on top of the image -->
            <div class="d-flex justify-content-center align-items-center h-100">
                <div class="text-white text-center">
                    <h1 class="mb-4">Learn more about us</h1>
                    <h5 class="mb-3">A dedicated team of web developers that specializes in crafting innovative,
                        user-friendly websites that enhance online experiences and drive success.</h5>
                    <p>We are all very different. We were born in different cities, at different times, we love
                        different music, food, movies. But we have something that unites us all. It is our company.</p>
                    <button class="btn btn-outline-light btn-lg m-2" @click="onContact()">Contact Us</button>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="media-container-row d-flex" style="margin-top: 5%">

            <div class="card p-3 col-12 col-md-6 col-lg-4 mx-2">
                <div class="card-img pb-3 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-people"
                        viewBox="0 0 16 16">
                        <path
                            d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                    </svg>
                </div>
                <div class="card-box">
                    <h4 class="card-title py-3 mbr-fonts-style display-5 text-center">
                        Creativity</h4>
                    <p class="mbr-text mbr-fonts-style display-7 text-center">
                        We thrive on thinking outside the box.
                        From brainstorming sessions to code reviews, creativity is woven into the fabric of everything
                        we do.
                    </p>
                </div>
            </div>

            <div class="card p-3 col-12 col-md-6 col-lg-4 mx-2">
                <div class="card-img pb-3 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-globe-europe-africa"
                        viewBox="0 0 16 16">
                        <path
                            d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M3.668 2.501l-.288.646a.847.847 0 0 0 1.479.815l.245-.368a.81.81 0 0 1 1.034-.275.81.81 0 0 0 .724 0l.261-.13a1 1 0 0 1 .775-.05l.984.34q.118.04.243.054c.784.093.855.377.694.801-.155.41-.616.617-1.035.487l-.01-.003C8.274 4.663 7.748 4.5 6 4.5 4.8 4.5 3.5 5.62 3.5 7c0 1.96.826 2.166 1.696 2.382.46.115.935.233 1.304.618.449.467.393 1.181.339 1.877C6.755 12.96 6.674 14 8.5 14c1.75 0 3-3.5 3-4.5 0-.262.208-.468.444-.7.396-.392.87-.86.556-1.8-.097-.291-.396-.568-.641-.756-.174-.133-.207-.396-.052-.551a.33.33 0 0 1 .42-.042l1.085.724c.11.072.255.058.348-.035.15-.15.415-.083.489.117.16.43.445 1.05.849 1.357L15 8A7 7 0 1 1 3.668 2.501" />
                    </svg>
                </div>
                <div class="card-box">
                    <h4 class="card-title py-3 mbr-fonts-style display-5 text-center">
                        Worldwide</h4>
                    <p class="mbr-text mbr-fonts-style display-7 text-center">
                        From web development to digital marketing, our expertise knows no bounds. Whether you're in New
                        York or Tokyo, our global team is ready to elevate your online presence and drive success across
                        continent.
                    </p>
                </div>
            </div>

            <div class="card p-3 col-12 col-md-6 col-lg-4 mx-2">
                <div class="card-img pb-3 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-emoji-smile-upside-down"
                        viewBox="0 0 16 16">
                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1m0-1a8 8 0 1 1 0 16A8 8 0 0 1 8 0" />
                        <path
                            d="M4.285 6.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 4.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 3.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 9.5C7 8.672 6.552 8 6 8s-1 .672-1 1.5.448 1.5 1 1.5 1-.672 1-1.5m4 0c0-.828-.448-1.5-1-1.5s-1 .672-1 1.5.448 1.5 1 1.5 1-.672 1-1.5" />
                    </svg>
                </div>
                <div class="card-box">
                    <h4 class="card-title py-3 mbr-fonts-style display-5 text-center">
                        Unique Styles
                    </h4>
                    <p class="mbr-text mbr-fonts-style display-7 text-center">
                        We offer standout services tailored to your needs, from custom web development to cutting-edge
                        digital marketing strategies. Our goal is simple: <br><i>make your brand shine in the digital
                            world.
                        </i></p>
                </div>
            </div>
        </div>
        <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner" style="margin: 10% 0" data-visible="5">
                <div class="carousel-item active">
                    <div class="media-container-row">
                        <div class="col-md-12">
                            <div class="wrap-img">
                                <img src="../staff/erina.jfif" media-simple="true" alt="Slide 1"
                                    style="border-radius: 50%">
                            </div>
                            <div class="text-center mt-3">
                                <h4 class="my-1">Erinë Gashi</h4>
                                <h6>Team Lead</h6>
                                <p>Empowering my team to overcome challenges, celebrate victories, and constantly grow
                                    together on the journey of building remarkable digital experiences.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="media-container-row">
                        <div class="col-md-12">
                            <div class="wrap-img">
                                <img src="../staff/altini.jpg"
                                    class="img-responsive clients-img" media-simple="true" alt="Slide 1">
                            </div>
                            <div class="text-center">
                                <h4 class="my-1">Altin Statovci</h4>
                                <h6>Full Stack Dev</h6>
                                <p>Coding is the ultimate form of expression in the digital age, where ideas become
                                    interactive, and innovation thrives in the dance of algorithms.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="media-container-row">
                        <div class="col-md-12">
                            <div class="wrap-img">
                                <img src="../staff/besnik.png" class="img-responsive clients-img" media-simple="true"
                                    alt="Slide 1">
                            </div>
                            <div class="text-center">
                                <h4 class="my-1">Besnik Begunca</h4>
                                <h6>Full Stack Dev</h6>
                                <p>Behind every great software, there's a coder who dared to dream, to challenge, and to
                                    bring imagination to life, one line at a time.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="media-container-row">
                        <div class="col-md-12">
                            <div class="wrap-img">
                                <img src="../staff/blendi.jpg" class="img-responsive clients-img" media-simple="true"
                                    alt="Slide 1">
                            </div>
                            <div class="text-center">
                                <h4 class="my-1">Blendi Miftari</h4>
                                <h6>Full Stack Dev</h6>
                                <p>Committed to delivering excellence in every line of code. A problem solver at heart,
                                    always seeking elegant solutions.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="media-container-row">
                        <div class="col-md-12">
                            <div class="wrap-img">
                                <img src="https://mobirise.com/bootstrap-template/about-us-page-template/assets/images/ayo-ogunseinde-316141-3333x3333.jpg"
                                    class="img-responsive clients-img" media-simple="true" alt="Slide 1">
                            </div>
                            <div class="text-center">
                                <h4 class="my-1">Drin Krasniqi</h4>
                                <h6>Full Stack Dev</h6>
                                <p>Transforming visions into functional and visually stunning websites. Committed to
                                    clean, efficient, and maintainable code.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="media-container-row">
                        <div class="col-md-12">
                            <div class="wrap-img">
                                <img src="../staff/eliza.jpg" class="img-responsive clients-img" media-simple="true"
                                    alt="Slide 1">
                            </div>
                            <div class="text-center">
                                <h4 class="my-1">Eliza Bleta</h4>
                                <h6>Full Stack Dev</h6>
                                <p>Empowering businesses with intuitive and user-friendly web solutions. Embracing
                                    challenges as opportunities for growth and innovation.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="media-container-row">
                        <div class="col-md-12">
                            <div class="wrap-img">
                                <img src="../staff/elsa.jpg" class="img-responsive clients-img" media-simple="true"
                                    alt="Slide 1">
                            </div>
                            <div class="text-center">
                                <h4 class="my-1">Elsa Rrustemi</h4>
                                <h6>Full Stack Dev</h6>
                                <p>Striving to make the web a more beautiful, functional, and user-friendly place for
                                    all.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="media-container-row">
                        <div class="col-md-12">
                            <div class="wrap-img">
                                <img src="https://mobirise.com/bootstrap-template/about-us-page-template/assets/images/ayo-ogunseinde-316141-3333x3333.jpg"
                                    class="img-responsive clients-img" media-simple="true" alt="Slide 1">
                            </div>
                            <div class="text-center">
                                <h4 class="my-1">Muhamed Hyseni</h4>
                                <h6>Full Stack Dev</h6>
                                <p>Committed to writing code that not only works flawlessly but also tells a story.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Add more carousel items here -->
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls"
                data-bs-slide="prev">
                <svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" fill="rgb(0,0,0)"
                    class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                    <path
                        d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                </svg>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls"
                data-bs-slide="next">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="rgb(0,0,0)"
                    class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                    <path
                        d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                </svg>
            </button>
        </div>
    </div>



</template>

<style scoped>
.bg-image {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
}

.mask {
    background-color: rgba(0, 0, 0, 0.6);
    /* Adjust the opacity here for more or less shading */
}


svg {
    margin: 0 auto;
    width: 100px;
    height: 100px;
}

.wrap-img {
    display: flex;
    justify-content: center;
}

.clients-img {
    width: 250px;
    height: 250px;
    border-radius: 50%;
}

.carousel-control-prev,
.carousel-control-next {
    width: 30px;
}
</style>

