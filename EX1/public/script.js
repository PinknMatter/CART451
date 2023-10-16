document.getElementById("searchForm").addEventListener("submit", function(event){
    event.preventDefault();

    const date = document.getElementById("dateInput").value;
    fetch(`/search?date=${date}`)
        .then(response => response.json())
        .then(data => {
            const resultsHeader = document.getElementById("resultsHeader");
            resultsHeader.textContent = `Most Popular Songs for ${date}`;

            const songArea = document.getElementById("songArea");
            songArea.innerHTML = '';  

            const seenSongs = new Set(); 

            if (data.length === 0) {
                songArea.textContent = 'No songs found';
                return;
            }

            data.forEach(song => {
                if (!seenSongs.has(song.title)) { 
                    seenSongs.add(song.title);  

                    const songDiv = document.createElement("div");
                    const maxStreams = Math.max(...data.map(s => s.streams));
                    const fontSize = ((song.streams / maxStreams) * 20) + 30; // Dynamically adjust the font size based on streams
                    const opacity = song.streams / maxStreams - 0.2; // Adjust the opacity based on streams

                    songDiv.textContent = `${song.title} by ${song.artist}`;
                    songDiv.style.fontSize = `${fontSize}px`;
                    songDiv.style.color = `rgba(200,20,0,${opacity})`;
                    songArea.appendChild(songDiv);
                }
            });
        });
});
