//keitaro endpoint

//https://balltombfightprivacy.xyz/BllTmbFghtKxdhedq?sub_id_1={sub1}&sub_id_2={sub2}&sub_id_3={sub3}&sub_id_4={sub4}&pixel=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD&domain=https://av-gameprivacypolicy.site/app

//BACKEND_URL='http://localhost:4000'

const marketingLink= "" // facebookLink

const modifiedEndpoint = 'http://localhost:4000/BllTmbFghtKxdhedq?sub_id_1={sub1}&sub_id_2={sub2}&sub_id_3={sub3}&sub_id_4={sub4}&pixel=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD&domain=https://av-gameprivacypolicy.site/app'

//result
// {
//     requestURL: '/BllTmbFghtKxdhedq?sub_id_1={sub1}&sub_id_2={sub2}&sub_id_3={sub3}&sub_id_4={sub4}&pixel=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD&domain=https://av-gameprivacypolicy.site/app'
//   }
//   {
//     Query: {
//       sub_id_1: '{sub1}',
//       sub_id_2: '{sub2}',
//       sub_id_3: '{sub3}',
//       sub_id_4: '{sub4}',
//       pixel: '714981180129689',
//       token: 'EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD',
//       domain: 'https://av-gameprivacypolicy.site/app'
//     }
//   }

const newLink = "https://balltombfightprivacy.xyz/BllTmbFghtKxdhedq?sub1={sub1}&sub2={sub2}&sub3={sub3}&sub4={sub4}&pixel=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD&domain=https://av-gameprivacypolicy.site/app"

const facebookLink1 = "https://www.dmtgames.pro/?appId=appId&sub_id_1=NPR&sub_id_2=WGTSB68DJB&sub_id_3=3713620758886014&sub_id_4=3713620758886014&sub_id_5=MCA&sub_id_6=EAA0xhLYp9n4BO4OtzAX6Yy2IaOgQdZAxvcNcmmjaL03zda7fiJG01PjrTlDEmTYXnQz58umZAUYvjPH0LhdqPvlwDcmorQe22BZAUkZAPtcPZC2oJEczMWBOgh8My3kfR713nqNC3rXipgWuy6uvp8jp67Y4ClqT65DjY3pvMXCZAZCUw6uEOIucv0y87rmo8Bp&sub_id_7=NPR&sub_id_8=unity"
const facebookLink2 = "http://localhost:4000/?appId=appId&sub_id_1=NPR&sub_id_2=WGTSB68DJB&sub_id_3=3713620758886014&sub_id_4=3713620758886014&sub_id_5=MCA&sub_id_6=EAA0xhLYp9n4BO4OtzAX6Yy2IaOgQdZAxvcNcmmjaL03zda7fiJG01PjrTlDEmTYXnQz58umZAUYvjPH0LhdqPvlwDcmorQe22BZAUkZAPtcPZC2oJEczMWBOgh8My3kfR713nqNC3rXipgWuy6uvp8jp67Y4ClqT65DjY3pvMXCZAZCUw6uEOIucv0y87rmo8Bp&sub_id_7=NPR&sub_id_8=unity"


const k = "http://localhost:4000/BllTmbFghtKxdhedq?sub_id_1=NPR&sub_id_2=125&sub_id_3=testing&sub_id_4=market_id&pixel=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD&domain=https://av-gameprivacypolicy.site/app"

const newEndpoint = "https://balltombfightprivacy.xyz/BllTmbFghtKxdhedq?sub_id_1=NPR&sub_id_2=125&sub_id_3=testing&sub_id_4=market_id&pixel=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD&domain=https://av-gameprivacypolicy.site/app"

/**
 * 
 * 
 1. https://www.dmtgames.pro/?sub_id_1=NPR&sub_id_2=291735090&fbp=714981180129689&pixel=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD&domain=https://av-gameprivacypolicy.site/app

2. https://www.dmtgames.pro/?sub_id_1=NPR&fbp=714981180129689&pixel=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD&domain=https://av-gameprivacypolicy.site/app

3. https://www.dmtgames.pro/?sub_id_1=NPR&sub_id_2=291735090&sub_id_3=NPR&sub_id_4=vidos1&pixel=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD&domain=https://av-gameprivacypolicy.site/app
 */

const facebookLink = "https://www.dmtgames.pro/?sub_id_1=NPR&sub_id_2=291735090&sub_id_3=NPR&sub_id_4=vidos1&pixel=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD&domain=https://av-gameprivacypolicy.site/app"
const keitaroTrackingEndpoint ="https://balltombfightprivacy.xyz/BllTmbFghtKxdhedq?sub_id_1=NPR&sub_id_2=291735090&sub_id_3=NPR&sub_id_4=vidos1&pixel=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD&domain=https://av-gameprivacypolicy.site/app"