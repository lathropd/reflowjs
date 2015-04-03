reflowjs
========

ReflowJS is a library for creating visually driven landing pages. It was created on behalf of the Atlanta-Journal Constitution, and I am deeply tankful for their support in creating it and their blessing to release it open source.

It's simple to install.

You can clone the whole thing into a web visible directory. But you'll need a way to put the admin.html and preview.html files behind security as they have the credentials to view your Dropbox account in plain view.

You then need to up your app as a development mode application, based on the guidance here:

[Dropbox developer support](https://www.dropbox.com/developers/support)

In index.html you need to set:

 * _googleKey_ to a valid Google Maps API key


In admin.html you need to set:
 * Dropbox.Client _key_
 * Dropbox.Client _token_
 * _webUrl_ to the location of the production copy of index.html
 * _previewUrl_ to the production location of preview.html


In preview.html you need to set:
* _googleKey_ to a valid Google Maps API key
* Dropbox.Client _key_
* Dropbox.Client _token_

The Dropbox.Client _key_ and _token_ go to a valid Dropbox developer account.
I recommend setting up a specific account for this app since those keys allow access to everything in the app. You get those from the Dropbox developer site.

One excellent way to handle the security issue for admin.html and preview.html is to use a .htaccess file to put a simple password on them, assuming you're on an apache server that supports that. If you're using Amazon Web Services S3, you can user security policies to restrict the IP addresses that are allowed to see those files.  You can see instructions in the [AWS Docs](http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteAccessPermissionsReqd.html).


Dependencies and Inspiration
--
This project would not be possible without the hard work of a lot of other folks.
Most of what is being used can be inferred by looking through the vendor directory. You can run this without installing any of those other libraries, and I recommend you do.

You may also notice that the main index.html page functions without loading JQuery. This was an attempt to minimize the number of dependencies, given the large number already in play, and speed up page loading.

But you may be interested in where the various building blocks came from, in case you want to customize things on your own.


So, here goes:
 * [simple-slideshow.css and better-simple-slideshow.js](https://github.com/leemark/better-simple-slideshow) by Mark Lee;
 * [Timeline.css](https://github.com/christian-fei/Timeline.css) by Christian Fei and customized by me;
  * [Packery](http://packery.metafizzy.co) by David DeSandro (under David's open source license);
  * [Miso.Dataset](http://misoproject.com/dataset/) from the Miso Project;
  * [Sticky Toolbar](http://www.backslash.gr/content/blog/webdevelopment/6-navigation-menu-that-stays-on-top-with-jquery) by Nick Tsaganos.

If you have feature requests, suggestions or need assistance, email me: daniel.lathrop at gmail.com.

Warnings
--
At present there are a few things lingering about this project that are specific to the Atlanta Journal-Constituion and MyAJC.com in the directions and in the handling of Brightcove. Expect a *non-AJC* branch in the near future.
