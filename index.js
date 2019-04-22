'use strict';

const clientId = '8f49b38a'
const searchUrl = 'https://api.jamendo.com/v3.0/tracks/'
let maxResults = 10;

function toggleAudio(url){
    console.log("playAudio ran.")
    let song = new Audio(url);
    song.play();
}

function watchAudio(){
    console.log("watchAudio ran.")
    $('button').on('click', function(){
        let url = $(this).val();
        console.log(url);
        toggleAudio(url);
    })
}

function displayResults(responseJson){
    console.log(responseJson);
    $('#songResults').remove();
    $('#results-list').append('<form><ol id="songResults"></ol></form>');
    if(maxResults > responseJson.results.length){
        for(let i = 0; i < responseJson.results.length; i++){
            $('#songResults').append(`
            <li>
            <p>${responseJson.results[i].name}</p>
            <button type="button" value="${responseJson.results[i].audio}">Play</button><img class="albumArt" src="${responseJson.results[i].album_image}">
            </li>
            `)
        }   
    }else{
        for(let i = 0; i < maxResults; i++){
            $('#songResults').append(`
            <li>
            <img src="${responseJson.results[i].album_image}">
            <p>${responseJson.results[i].name}</p>
            `)
        }
    }
    watchAudio();
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
  }

function findSongs(searchTerm, maxResults){
    const params = {
        client_id: clientId,
        namesearch: searchTerm,
        limit: maxResults
    }

    const queryString = formatQueryParams(params)
    const url = searchUrl + '?' + queryString;

    fetch(url)
    .then(response => response.json())
    .then(responseJson => displayResults(responseJson))
}

function watchForm(){
    $('#js-form').submit(function(event){
        event.preventDefault();
        let searchTerm = $('#js-search-term').val();
        maxResults = $('#js-max-results').val();
        console.log(searchTerm+" "+maxResults);
        findSongs(searchTerm, maxResults);
    })
  }

$(function(){
    console.log('Playlist Creator Loaded.');
    watchForm();
  })
  