'use strict';

const clientId = '8f49b38a'
const searchUrl = 'https://api.jamendo.com/v3.0/tracks/'
let maxResults = 10;

function runPlaylist(){
    let audio = $('#playlistAudio');

}

function finializedPlaylist(){
    $('#finalPlaylist').on('click', function(){
        let playlist = $('#playlist').find('li');
        $('#js-form').remove();
        $('#songsContainer').remove();
        $('.container').append(`<h2 id="songTitle">Now Playing: </h2><audio id="playlistAudio" preload="auto" tabindex="0" controls=""></audio><ol id="finalPlaylistContainer"></ol>`);
        $('#finalPlaylistContainer').append(playlist)
        $('#finalPlaylistContainer').find('source')
        let track0Title = $('#finalPlaylistContainer').find('p').first().clone();
        let track0 = $('#finalPlaylistContainer').find('source').first().clone();
        $('#songTitle').append(track0Title);
        $('#playlistAudio').append(track0);
        console.log(playlist, track0);
    })
}

function returnToLandingPage(){
    $('#title').on('click', function(){
        location.reload();
    })
}

function removeSearchResults(){
    $('#results').on('click', '#clearSearch', function(){
        $('#songResults').remove();
        $('#results').addClass('hidden');
    })
}

function removeFromPlaylist(){
    $('#playlist').on('click', '.removeFromPlaylist', function(){
        $(this).removeClass('removeFromPlaylist').html('Add to Playlist').addClass('addToPlaylist');
        let removedSong = $(this).parent();
        $(this).parent().remove();
        $('#songResults').prepend(removedSong);
    })
}

function addToPlaylist(){
    $('#results').on('click', '.addToPlaylist', function(){
        $(this).removeClass('addToPlaylist').html('Remove from Playlist').addClass('removeFromPlaylist');
        let addedSong = $(this).parent();
        $(this).parent().remove();
        $('#playlist').append(addedSong);
    })
}

function displayResults(responseJson){
    console.log(responseJson);
    $('#songResults').remove();
    $('#results').removeClass('hidden');
    $('#playlistContainer').removeClass('hidden');
    $('#results-list').append('<ol id="songResults"></ol>');
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
    removeFromPlaylist();
    removeSearchResults();
    returnToLandingPage();
    finializedPlaylist();
    runPlaylist();
  })
  