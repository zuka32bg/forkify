import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

// import icons from '../img/icons.svg'; parcel 1
import icons from 'url:../img/icons.svg'; //error u index.html
import 'core-js/stable';
import 'regenerator-runtime/runtime';
const recipeContainer = document.querySelector('.recipe');

// if (module.hot) {
//   module.hot.accept();
// }
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    // 3) Render bkmrk
    bookmarksView.render(model.state.bookmarks);
    // update results view za markovane sr
    resultsView.update(model.getSearchResultsPage());

    //ucitavanje recepta
    await model.loadRecipe(id);

    // renderovanje recep
    recipeView.render(model.state.recipe);

    // update  bkmrk
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //get srch querry
    const query = searchView.getQuery();
    if (!query) return;
    //ucitavanje src
    await model.loadSearchResults(query);
    //render
    // resultsView.render(model.state.search.results); svi rezultati

    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);

    //render initial pagination
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //render new res

  resultsView.render(model.getSearchResultsPage(goToPage));
  //render new pag buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // 1) dodavanje i uklanjanje bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipta
  recipeView.update(model.state.recipe);

  model.addBookmark(model.state.recipe);
  console.log(model.state.recipe);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  // addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

const clearBookmakrs = function () {
  localStorage.clear('bookmarks');
};
// clearBookmakrs();
