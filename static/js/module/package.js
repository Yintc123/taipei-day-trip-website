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
        'url_home':'http://3.115.234.130:3000/',
        'url_attraction':'http://3.115.234.130:3000/attraction/',
        'url_booking':'http://3.115.234.130:3000/booking',
        'url_thanks':'http://3.115.234.130:3000/thankyou',
        'url_member':'http://3.115.234.130:3000/member',
        'url_api_attraction':'http://3.115.234.130:3000/api/attraction/',
        'url_api_attraction_keyword':'http://3.115.234.130:3000/api/attractions?keyword=',
        'url_api_sign':'http://3.115.234.130:3000/api/user',
        'url_api_orders':'http://3.115.234.130:3000/api/orders',
        'url_api_order':'http://3.115.234.130:3000/api/order/',
        'url_api_user_order':'http://3.115.234.130:3000/api/user_order/',
        'url_api_booking':'http://3.115.234.130:3000/api/booking',
    }
};

const env='develop';
// const env='production';

export const url_mode=url[env];

export default url_mode;