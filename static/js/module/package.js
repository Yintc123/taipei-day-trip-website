const dn="tour.yin888.info";
const ip="3.115.234.130:3000"

const url={
    "develop":{
        'url_home':'http://127.0.0.1:3000/',
        'url_attraction':'http://127.0.0.1:3000/attraction/',
        'url_booking':'http://127.0.0.1:3000/booking',
        'url_thanks':'http://127.0.0.1:3000/thankyou',
        'url_member':'http://127.0.0.1:3000/member',
        'url_api_attraction':'http://127.0.0.1:3000/api/attraction/',
        'url_api_attraction_keyword':'http://127.0.0.1:3000/api/attractions?keyword=',
        'url_api_sign':'http://127.0.0.1:3000/api/user',
        'url_api_orders':'http://127.0.0.1:3000/api/orders',
        'url_api_order':'http://127.0.0.1:3000/api/order/',
        'url_api_user_order':'http://127.0.0.1:3000/api/user_order/',
        'url_api_booking':'http://127.0.0.1:3000/api/booking',
        
    },
    "production":{
        'url_home':'https://'+dn+'/',
        'url_attraction':'https://'+dn+'/attraction/',
        'url_booking':'https://'+dn+'/booking',
        'url_thanks':'https://'+dn+'/thankyou',
        'url_member':'https://'+dn+'/member',
        'url_api_attraction':'https://'+dn+'/api/attraction/',
        'url_api_attraction_keyword':'https://'+dn+'/api/attractions?keyword=',
        'url_api_sign':'https://'+dn+'/api/user',
        'url_api_orders':'https://'+dn+'/api/orders',
        'url_api_order':'https://'+dn+'/api/order/',
        'url_api_user_order':'https://'+dn+'/api/user_order/',
        'url_api_booking':'https://'+dn+'/api/booking',
    }
};

// const env='develop';
const env='production';

export const url_mode=url[env];

export default url_mode;