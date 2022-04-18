import {BsSearch} from 'react-icons/bs'

import './index.css'

const FiltersGroup = props => {
  const {changeSearchInput, clearFilterBtn, searchInput} = props
  const onChangeSearchInput = event => {
    changeSearchInput(event.target.value)
  }

  const getCategoryList = () => {
    const {categoryOptions} = props

    return categoryOptions.map(eachCategory => {
      const {onSelectCategory, activeCategoryId} = props
      const onClickCategory = () => {
        onSelectCategory(eachCategory.categoryId)
      }
      const categoryStyle =
        eachCategory.categoryId === activeCategoryId
          ? `category-name active-category-name`
          : `category-name`

      return (
        <li
          key={eachCategory.categoryId}
          className="category-item"
          onClick={onClickCategory}
        >
          <p className={categoryStyle}>{eachCategory.name}</p>
        </li>
      )
    })
  }

  const getRatingList = () => {
    const {ratingsList} = props

    return ratingsList.map(eachRating => {
      const {onSelectRating, activeRatingId} = props
      const onClickRating = () => {
        onSelectRating(eachRating.ratingId)
      }
      const activeUpText =
        eachRating.ratingId === activeRatingId
          ? `and-up active-rating`
          : `and-up`

      return (
        <li
          onClick={onClickRating}
          key={eachRating.ratingId}
          className="rating-item"
        >
          <img
            src={eachRating.imageUrl}
            alt={`rating ${eachRating.ratingId}`}
            className="rating-img"
          />
          <p className={activeUpText}>& up</p>
        </li>
      )
    })
  }

  const onClickclearResults = () => {
    clearFilterBtn()
  }

  const onEnterSearchInput = event => {
    const {enterSearchInput} = props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  return (
    <div className="filters-group-container">
      <div className="search-input-container">
        <input
          type="search"
          className="search-input"
          onChange={onChangeSearchInput}
          placeholder="Search"
          value={searchInput}
          onKeyDown={onEnterSearchInput}
        />
        <BsSearch className="search-icon" />
      </div>
      <div>
        <h1 className="category-heading">Category</h1>
        <div className="categories-list">{getCategoryList()}</div>
      </div>
      <div>
        <h1 className="rating-heading">Ratings</h1>
        <ul className="ratings-list">{getRatingList()}</ul>
      </div>
      <button
        onClick={onClickclearResults}
        type="button"
        className="clear-filters-btn"
      >
        Clear Filters
      </button>
    </div>
  )
}
export default FiltersGroup
