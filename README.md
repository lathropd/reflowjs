reflowjs
========

ReflowJS is a library for creating visually driven landing pages. It was created on behalf of the Atlanta-Journal Constitution, and I am deeply tankful for their support in creating it and their blessing to release it open source.

It's simple to install.

You can clone the whole thing into a web visible directory. But you'll need a way to put the admin.html and preview.html files behind security. In index.html you need to set the _googleKey_ JavaScript variable, in admin.html you need to set the Dropbox.Client _key_ and _token_ parameters. In preview.html you need to set _googleKey_ and the Dropbox.Client _key_ and _token_.

The Dropbox.Client _key_ and _token_ go to a Dropbox account. You need to set it up as a development mode application, based on the guidance here:
https://www.dropbox.com/developers/support[https://www.dropbox.com/developers/support]

I recommend setting up a specific account for this app since those keys allow access to everything in the app.
