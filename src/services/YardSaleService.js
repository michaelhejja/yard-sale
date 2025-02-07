import http from "./http-common"

class YardSaleService {
  getAppState() {
    return http.get('/state')
  }

  updateAppState(isActive, canPurchase, showComingSoon, currentProductIndex, currentDiscount) {
    return http.post(`/updateAppState`, {
      isActive: isActive,
      canPurchase: canPurchase,
      showComingSoon: showComingSoon,
      currentProductIndex: currentProductIndex,
      currentDiscount: currentDiscount
    })
  }
}

export default new YardSaleService()
