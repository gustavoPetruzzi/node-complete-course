exports.getPosts = (req, res, next) => {
    
    res.status(200).json({
        posts: [
            {
                _id: '1',
                title: 'First Post',
                content: 'this is a post',
                imageUrl: 'images/moscaysmithpetracca.jpg',
                creator:{
                    name:'Yusti'
                },
                createdAt: new Date()
            }
        ]
    })
}

exports.createPost = (req, res, next) =>{
    const title = req.body.title;
    const content = req.body.content;
    console.log(title);
    console.log(content);
    res.status(201).json({
        message: 'post create',
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content,
            creator: 'Yusti',
            createdAt: new Date()
        }
    })
}