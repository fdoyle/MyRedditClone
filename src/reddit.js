var HelloWorld = React.createClass({
    render: function() {
        return (
            <p>hello world</p>
        )
    }
})

function fetchJson(url, func) {
    var myInit = { method: 'GET',
               mode: 'cors',
               cache: 'default' };
    var proxyUrl = "http://cors.io/?u="+url
    fetch(url, myInit).then(function(result){ //ohgodwhy :<
        return result.json();
    }).then(func);
}

function getSubreddits(func) {
    fetchJson("https://www.reddit.com/reddits.json",func)
}

function getSub(sub, func) {
    var url = "https://www.reddit.com/r/" + sub + ".json"
    console.log(url);
    fetchJson(url,func)
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

var NavItem = React.createClass({
    onClick:function() {
        this.props.navItemClicked(this.props.subreddit);
    },
    render: function(){
        return <li
                key={this.props.subreddit.key}
        onClick={this.onClick}
                    className={this.props.className}>
                {this.props.subreddit}</li>
    }
});

var NavBar = React.createClass({
    selectSubreddit: function(title) {
        this.setState({
            current:title
        })
        this.props.setItemSelected(title)
    },
    getInitialState: function() {
        return {
            current:"",
            subreddits:[]
        }
    },
    componentDidMount: function() {
        var _this = this;
        getSubreddits(function(json) {
            var subs = json.data.children.map(function(child) {
                return child.data;
            });
            _this.setState({
                subreddits:subs
            });
            if(_this.state.current === "") {
                _this.selectSubreddit(_this.state.subreddits[0].display_name);
            }
        })
    },
    render: function() {
        var _this = this;
        var items = this.state.subreddits.map(function(sub) {
            var selectedClassName = ((_this.state.current === sub.display_name) ? "selected" : "" ) + " navitem";
            return  <NavItem navItemClicked={_this.selectSubreddit}
                            subreddit={sub.display_name}
                            className={selectedClassName}/>
        });
        return <div className="navigation">
                    <ul>
                        {items}
                    </ul>
                </div>

    }
})

var Story = React.createClass({
    componentDidMount: function() {

    },
    render: function() {
        var story = this.props.story;
        var image
        var hasPic = !["", "self","default", "nsfw"].contains(story.thumbnail);
        if(hasPic) {
            image = <img className="thumbnail" src={story.thumbnail}/>
        } else {
            image = <img className="thumbnail" src="https://lh5.googleusercontent.com/SOiqaJFToxe_-OTQ1rjhiNKDhPnwf1eH0UakoKKvpf_znHhJe2xES-9wn64_oLo1nkkEETCG=s128-h128-e365"/>
        }

        return <tr>
                    <td>
                        {image}
                    </td>
                    <td>
                        <p className="score">{story.score}</p>
                    </td>

                    <td>
                        <p><a href={story.url} className="title">{story.title}</a><br/>
                        <span className="author">Posted by <b>{story.author}</b></span>
                        </p>
                    </td>
                    <td>
                    </td>
                </tr>
    }
})

var StoryList = React.createClass({
    getInitialState: function() {
        return {
            storyList:[]
        }
    },
    componentDidMount: function() {
        var subredditTitle = this.props.sub;
        var _this= this;
    },
    render: function() {
        var listItems = this.props.storyList.map(function(item) {
            return <Story story={item}/>
        });
        return  <div>
                    <h1>{this.state.subreddit}</h1>
                    <table>
                        {listItems}
                    </table>
                </div>
    }
})

var App = React.createClass({
    getInitialState: function() {
        return {
            storyList:[],
            data:"loading",
        };
    },
    setSelectedSubreddit: function(newSub) {
        console.log("selected " + newSub);
        var _this = this;
        this.setState({
            storyList:[],
            subreddit:newSub
        })
        getSub(newSub, function(json) {
            console.log(json);
            var children = json.data.children.map(function(child) {
                return child.data;
            });
            _this.setState({
                storyList:children,
                subreddit:newSub
            })
        })

    },
    componentDidMount: function() {

    },
    render: function() {
        return <div>
                 <NavBar setItemSelected={this.setSelectedSubreddit}/>
                 <StoryList sub={this.state.subreddit} storyList={this.state.storyList}/>
            </div>
    },
    itemSelected: function(item) {
        this.setState({
            selectedSubreddit:item
        })
    }
})

ReactDOM.render(
    <div>
        <App/>
    </div>,
  document.getElementById('container')
);
