module.exports = {
    parseUsername: function (inputBody) {
        return inputBody["username"]
    },

    parseLobbyId: function (inputBody) {
        return inputBody["lobbyId"]
    },

    generatePlayerListBody: function (playerList) {
        var result = { "players": [] };
        for (var i = 0; i < playerList.length; i++) {
            result["players"].push(playerList[i])
        }
        return result;
    }
}
