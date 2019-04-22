'use strict';

const clientId = '8f49b38a'
const searchUrl = 'https://api.jamendo.com/v3.0/tracks/'
let maxResults = 10;

function addToPlaylist(){
    $('#results').on('click', 'button', function(){
        $(this).html('<button type="button" class="removeFromPlaylist">Remove from Playlist</button>');
        let newSong = $(this).parent();
        $(this).parent().remove();
        $('#playlist').append(newSong);
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
            <span class="songContainer">
            <p>${responseJson.results[i].name}</p>
            <audio controls>
            <source src="${responseJson.results[i].audio}" type="audio/mpeg">
            </audio controls>
            </span>
            <button type="button" class="addToPlaylist">Add to Playlist</button>
            </li>
            `)
        }   
    }else{
        for(let i = 0; i < responseJson.results.length; i++){
            $('#songResults').append(`
            <li>
            <span class="songContainer">
            <p>${responseJson.results[i].name}</p>
            <audio controls>
            <source src="${responseJson.results[i].audio}" type="audio/mpeg">
            </audio controls>
            </span>
            <button type="button" class="addToPlaylist">Add to Playlist</button>
            </li>
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
    addToPlaylist();
  })
  