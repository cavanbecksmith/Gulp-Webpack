module.exports = {	
	watch:false,
	output:{
	},
	module:{
		loaders:[ 
				{ test: /\.js$/, 	loader: "babel-loader" },
			]
	}
};