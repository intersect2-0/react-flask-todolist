(function () {
  var TodoBox = React.createClass({
      loadCommentsFromServer: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },
      handleItemSubmit: function(item){
        var items = this.state.data;
        var newItems = items.concat([item]);
        this.setState({data: newItems});
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          type: 'POST',
          data: item,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },
      getInitialState: function() {
          return {data: []}
      },
      componentDidMount: function() {
        this.loadCommentsFromServer();
        //setInterval(this.loadCommentsFromServer, this.props.pollInterval)
      },
      render: function() {
          return (
                  <div className = "todoBox">
                          <h1>Todo</h1>
                          <TodoList  data={this.state.data}/>
                          <TodoForm onItemSubmit={this.handleItemSubmit}/>
                  </div>
          );
      }
  });

  var TodoForm = React.createClass({
      handleSubmit: function(e) {
          e.preventDefault();
          var text = React.findDOMNode(this.refs.text).value.trim();
          if (!text) return;
          this.props.onItemSubmit({text: text});
          React.findDOMNode(this.refs.text).value = '';
          return;
      },
      render: function(){
          return (
                  <form className="todoForm" onSubmit={this.handleSubmit}>
                      <input type="text" placeholder="What's up?"  ref="text"/>
                      <input type="submit" value="Post" />
                  </form>
          );
      }
  });

  var TodoList = React.createClass({
      render: function() {
          var itemNodes = this.props.data.map(function (item) {
              return (
                      <TodoItem date={item.date}>
                      {item.text}
                      </TodoItem>
              );
          });
          return (
                  <div className="todoList">
                  {itemNodes}
                  </div>
          );
      }
  });

  var TodoItem = React.createClass({
      render: function() {
          return (
                  <div className="todoItem">
                          <h1 className="itemText">
                          {this.props.children}
                          </h1>
                          {this.props.date}
                  </div>
          );
      }
  });
  React.render(
          <TodoBox url="/todolist" pollInterval={2000}/>,
          document.getElementById('content')
  );

})();