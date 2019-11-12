'use strict';

const clientId = '8f49b38a'
const searchUrl = 'https://api.jamendo.com/v3.0/tracks/'
let maxResults = 50;
let current = 0;

function finializedPlaylist(){
    $('#finalPlaylist').on('click', function(){
        let count = $('#playlist').children().length;
        if(count >= 1){
            let playlist = $('#playlist').find('p, source');
            $('#js-form').remove();
            $('#songsContainer').remove();
            $('.container').append(`<h2 id="songTitle"></h2><audio id="playlistAudio" tabindex="0" controls></audio><ol id="finalPlaylistContainer"></ol>`);
            $('#finalPlaylistContainer').append(playlist);
            $('p').wrap('<li class="finalPlaylistSongs"></li>');
            let trackTitles = $('#finalPlaylistContainer').find('p').clone().toArray();
            let track = $('#finalPlaylistContainer').find('source').clone().toArray();
            $('#finalPlaylistContainer').find('p').before(`<button class="play" type="button">Play</button>`);
            console.log(track);
            $('#songTitle').append(trackTitles[0]);
            $('#playlistAudio').append(track[0]);
            $('#finalPlaylistContainer p').addClass('song');
            $('#finalPlaylistContainer p:first').addClass('active');
            $('footer').removeClass('hidden');
            
            runPlaylist(trackTitles, track, current);
            chooseSong(trackTitles, track, current);
        }else{
            alert("Please select at least 1 song!");
        }
        
    })
}

function chooseSong(){
    $('#finalPlaylistContainer').on('click', '.play', function(){
        let audio = document.getElementById('playlistAudio');
        let chosenSongTitle = $(this).next().clone();
        let chosenSongTrack = $(this).parent().next().clone();
        $('.active').removeClass('active');
        $(this).next().addClass('active');
        $('#songTitle').children().replaceWith(chosenSongTitle);
        $('#playlistAudio').children().replaceWith(chosenSongTrack);
        audio.pause();
        audio.load();
        audio.play();
        let array = [];
        let elements = document.body.getElementsByTagName('p');
        for(let i = 0; i < elements.length; i++) {
            let currentNum = elements[i];
            if(currentNum.children.length === 0 && currentNum.textContent.replace(/ |\n/g,'') !== '') {
                // Check the element has no children && that it is not empty
                array.push(currentNum.textContent);
            }
        } 
        let songIndex = array.slice(1,array.length);
        console.log(songIndex);
        let songTitleIndex = chosenSongTitle.text();
        console.log(songTitleIndex);
        function findSongIndex(element){
            return element == songTitleIndex;
        }
        console.log(songIndex.findIndex(findSongIndex));
        current = songIndex.findIndex(findSongIndex);   
    })
}

function runPlaylist(trackTitles, track){
    console.log("Initial Current "+current);
    let audio = document.getElementById('playlistAudio');
    audio.volume =.10;
    audio.addEventListener('ended', function(event){
        current++;
        console.log("Current "+current)
        if(current === track.length){
            current = 0;
            $('.active').removeClass('active');
            $('#finalPlaylistContainer p:first').addClass('active');
            $('#playlistAudio').children().replaceWith(track[current]);
            $('#songTitle').children().replaceWith(trackTitles[current]);
            audio.load();
            audio.play();
            console.log(current + " Replay")
        }else{
            $('.active').removeClass('active').parent().next().next().children("p.song").addClass('active');
            $('#playlistAudio').children().remove()
            $('#playlistAudio').append(track[current]);
            $('#songTitle').children().remove();
            $('#songTitle').append(trackTitles[current]);
            audio.load();
            audio.play();
        }
    })
}

function returnToLandingPage(){
    $('#title').on('click', function(){
        let check = confirm("This will remove your playlist and cannot be undone.")
        if (check == true){
            location.reload();
        }
    })
    $('#restartButton').on('click', function(){
        let check = confirm("This will remove your playlist and cannot be undone.")
        if (check == true){
            location.reload();
        }
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
            </span><br>
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
            </span><br>
            <button type="button" class="addToPlaylist">Add to Playlist</button>
            </li>
            `)
        }   
    }

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
       // maxResults = $('#js-max-results').val();
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
  })
  