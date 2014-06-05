gitrelay
========
A simple webhook receiver that listens to a remote git repository changes and deploys files received via a POST request to predefined locations on the local machine or a remote one.

Gitrelay runs as a server that listens to git events. Once a git event is detected (e.g. a file commit), the event is relayed to the registered plugins.

A gitrelay plugin is simply an event listener that processes received data or triggers another event for a different plugin to process.

In the current version of gitrelay, there are 2 plugin available:
- a bitbucket plugin which reacts to the bitbucket POST webhook   
- a localgit plugin which execute pull requests from the local repo

These two plugins support the basic continuous-integration scenario: files updated in a Bitbucket repository are pushed to a dev or production server.

Have a look at the plugin directory to see how these plugins are implemented and feel free to add more.
