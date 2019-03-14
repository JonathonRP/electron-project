import todo_mvc

if __name__ == "__main__":
    app = todo_mvc.create_app()
    # run Flask app in debug mode
    app.run()
