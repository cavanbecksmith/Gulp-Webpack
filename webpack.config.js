module.exports = {	
	watch:false,
	output:{
		filename: '[name].js'
	},
	module:{
		loaders:[ 
			{ test: /\.js$/, 	loader: "babel-loader" },
		]
	}
};