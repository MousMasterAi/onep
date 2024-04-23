function dragOverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(ev) {
    ev.preventDefault();
    var dataTransfer = ev.dataTransfer;

    if (dataTransfer.items) {
        for (var i = 0; i < dataTransfer.items.length; i++) {
            if (dataTransfer.items[i].kind === 'file') {
                var file = dataTransfer.items[i].getAsFile();
                document.getElementById('file_input').files = dataTransfer.files;
            }
        }
    } else {
        document.getElementById('file_input').files = dataTransfer.files;
    }
}

function handleFileSelect(event) {
    // Afficher les fichiers sélectionnés à l'utilisateur si nécessaire
}
