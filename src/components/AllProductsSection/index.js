import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const constantApistatus = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStatus: constantApistatus.initial,
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: '',
    activeRatingId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: constantApistatus.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      activeRatingId,
      activeCategoryId,
      searchInput,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: constantApistatus.success,
      })
    } else {
      this.setState({apiStatus: constantApistatus.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  renderNoProductView = () => (
    <div className="no-prod-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="no-prod-img"
      />
      <h1 className="no-prod-head">No Products Found</h1>
      <p className="no-prod-desc">
        We could not find any products. Try other filters
      </p>
    </div>
  )

  renderProductsList = () => {
    const {productsList, activeOptionId, searchInput} = this.state
    const filteredData = productsList.filter(eachItem =>
      eachItem.title.toLowerCase().includes(searchInput.toLowerCase()),
    )

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        {filteredData.length < 1 ? (
          this.renderNoProductView()
        ) : (
          <ul className="products-list">
            {filteredData.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  clearFilterBtn = () => {
    this.setState(
      {
        activeCategoryId: '',
        activeRatingId: '',
        searchInput: '',
      },
      this.getProducts,
    )
  }

  onSelectCategory = categoryId => {
    this.setState({activeCategoryId: categoryId}, this.getProducts)
  }

  onSelectRating = ratingId => {
    this.setState({activeRatingId: ratingId}, this.getProducts)
  }
  // TODO: Add failure view

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderApiView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case constantApistatus.success:
        return this.renderProductsList()
      case constantApistatus.failure:
        return this.renderFailureView()
      case constantApistatus.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId, activeRatingId, searchInput} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          changeSearchInput={this.changeSearchInput}
          enterSearchInput={this.enterSearchInput}
          searchInput={searchInput}
          categoryOptions={categoryOptions}
          onSelectCategory={this.onSelectCategory}
          activeCategoryId={activeCategoryId}
          ratingsList={ratingsList}
          onSelectRating={this.onSelectRating}
          activeRatingId={activeRatingId}
          clearFilterBtn={this.clearFilterBtn}
        />
        {this.renderApiView()}

        {/* {isLoading ? this.renderLoader() : this.renderProductsList()} */}
      </div>
    )
  }
}

export default AllProductsSection
