Vue.component("restaurant-view", {
    data(){
      return{
          restaurant: this.$route.params.restaurant,
      }
    },
    template: 
    `
    <div class="container-fluid navigation-container pt-3 px-0">
      <div class="container-fluid d-none d-lg-block px-0">
        <img src="../assets/images/logos/full-logo.png" alt="Brand logo" id="full-logo">
      </div>
      <div class="container d-lg-none px-0">
        <img src="../assets/images/logos/foodly-logo.png" alt="Brand logo" id="foodly-logo">
      </div>
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container-fluid px-0">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active py-0" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link py-0" href="#">Orders</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link py-0" href="#">About us</a>
                </li>
            </ul>
          </div>
        </div>
        <div class="d-none d-lg-block">
          <div class="user-info-container d-flex flex-row-reverse mt-2">
            <div>
              <img src="../assets/icons/arrow-dark.png" alt="arrow" class="arrow-pic mx-2">
            </div>
            <span>
              Aleksa Vujisic
            </span>
            <div class="image-cropper mx-2">
              <img src="../assets/images/profile-picture.jpg" alt="avatar" class="profile-pic">
            </div>
            <div>
              <img src="../assets/icons/cart-dark.png" alt="shopping-cart" class="shopping-cart-pic mx-1">
            </div>
          </div> 
        </div>
      </nav>
    </div>
    `
});