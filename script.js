root = new Vue({
	el: "#root",
	data: {
		selectedUser: "",
		allMessages: [],
		password: ""
	},
	watch:{
		allMessages: function(){
			root.nUpdate();
		}
	},
	computed: {
		users: {
			cache: false,
			get: function() {
				var from = _.keys(_.groupBy(root.allMessages, function(o){return o.from}));
				var to = _.keys(_.groupBy(root.allMessages, function(o){return o.to}));
				var merged = _.merge(from, to);
				return merged.sort() || [];
			}
		},
		messages: {
			cache: false,
			get: function() {
				return _.filter(root.allMessages, function(o) {
					return o.to == root.selectedUser || o.from == root.selectedUser;
				});
			}
		}
	},
	methods: {
		get: function(a){
			root.allMessages = [];
			var config = {
				apiKey: "U2FsdGVkX19r2KQJEbJ9W9iQwdIoy3P9y+AuhP9l8c1NWXQ1VVK9TXuvjhXOEMogMyNMay08xy6eFXUYoB3UAA==",
				authDomain: "U2FsdGVkX19RUJWvhyOd7gP5WS3+wWT2snuyLmweVY2abJH9qAj62mAxkmeNLj5P",
				databaseURL: "U2FsdGVkX1/OmVGghMxZzSIcdseuspMn5TSrgesz7dq6j3w4NidqFo7ALXT2g1bc",
				projectId: "U2FsdGVkX1/O6wHUkIhfnOKGPb/Q7pDxuAdWfIkw2dQ=",
				storageBucket: "U2FsdGVkX1/AUnzGwODxP5IoUCNxlcpDKNaEujZsqlA5uKj/jG7Nr6GMZ6cwXnMh",
				messagingSenderId: "U2FsdGVkX19BoUgmSIbEXpSuxAz70AoBg4ctFmHzpb4="
			};
			var temp = {};
			for(i in config){
				temp[i] = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(config[i], a));
			}
			config = temp;
			insert = function(id, data) {
				firebase.database().ref(id).set(data);
			}
			firebase.initializeApp(config);
			firebase.database().ref("nMessages").orderByChild("time").on("child_added", function(data) {
				root.allMessages.push(data.val());
			});
		},
		nUpdate: function(){
			root.$forceUpdate();
		},
		deleteMessage: function(a){
			_.remove(root.allMessages, {
				"time": a
			});
			var ref = firebase.database().ref('nMessages/' + a);
			ref.remove().then(function() {
				root.nUpdate();
			}).catch(function(error) {
				alert("Remove failed: " + error.message);
			});
		}
	}
});
