let managerCustomerComponent = {
    data(){
        return{
            //date: this.order.dateOfOrder.match(/[^,]+,[^,]+/g)
        }
    },
    props:[
        'customer'
    ],
    template:
    `
    <div class="order-cards-container" v-if="customer">
        <div class="customer-card box-shadow">
            <div class="d-flex flex-column justify-content-center">
                <img class="customer-img" :src="customer.image"/>
            </div>
            <div class="d-flex flex-column justify-content-center">
                <span class="basic-title mb-1 nowrap">
                    Name & surname
                </span>
                <span class="me-2">{{customer.name}} {{customer.surname}}</span>
            </div>
            <div class="d-flex order-two flex-column justify-content-center">
                <span class="basic-title mb-1">
                    Username
                </span>
                <span class="me-2">{{customer.username}}</span>
            </div>
            <div class="d-flex flex-row align-items-center">
                <div class="d-flex me-3 justify-content-center align-items-center">
                    <img v-if="customer.buyerType == 'Golden buyer'" src="../assets/icons/gold-icon.png" class="order-details-img">
                    <img v-if="customer.buyerType == 'Silver buyer'" src="../assets/icons/silver-icon.png" class="order-details-img">
                    <img v-if="customer.buyerType == 'Bronze buyer'" src="../assets/icons/bronze-icon.png" class="order-details-img">
                </div>
                <div class="d-flex flex-column justify-content-center">
                    <span class="basic-title mb-1">
                        Status
                    </span>
                    <span v-if="customer.buyerType == 'Golden buyer'">Golden buyer</span>
                    <span v-if="customer.buyerType == 'Silver buyer'">Silver buyer</span>
                    <span v-if="customer.buyerType == 'Bronze buyer'">Bronze buyer</span>
                </div>
            </div>
        </div>
    </div>
    `
}