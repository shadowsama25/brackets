/*
 * Copyright 2011 Adobe Systems Incorporated. All Rights Reserved.
 */

/**
 * Set of utilites for working with the code editor
 */
define(function(require, exports, module) {

    require("thirdparty/path-utils/path-utils.min");

    /**
     * Change the current mode of the editor based on file extension 
     * @param {object} editor  An instance of a CodeMirror editor
     * @param {string} fileUrl  A cannonical file URL to extract the extension from
     */
    function setModeFromFileExtension( editor, fileUrl ) {
        var mimeForExt = _getMimeTypeFromFileExtensions( fileUrl );
        setModeFromFileMimetype( editor, mimeForExt );
    }

    /**
     * Change the current mode of the editor based on mimetype
     * @param {object} editor  An instance of a CodeMirror editor
     * @param {string} mimetype  A mimetype that matches one of the available modes
     */
    function setModeFromFileMimetype( editor, mimetype ) {
        _loadModeForMimeType(mimetype);
        editor.setOption("mode", mimetype);
    }

    /**
     * @private
     * Given a file URL, determines the most likely mimetype based
     * off the files extensions. The mapping is used for the text modes
     * @param {string} fileUrl  A cannonical file URL to extract the extension from
     */
    function _getMimeTypeFromFileExtensions( fileUrl ) {
        var ext = PathUtils.filenameExtension( fileUrl );
        //incase the arg is just the ext
        if( !ext )
            ext = fileUrl; 
        if( ext.charAt(0) == '.' )
            ext = ext.substr(1);

        switch( ext ) {

        case "js":
            return "text/javascript";

        case "json":
            return "application/json";

        case "css":
            return "text/css";

        case "less":
            return "text/less";

        case "html":
        case "htm":
        case "shtml":
        case "shtm":
            return "text/html";

        default:
            console.log("Called EditorUtils.js _getMimeTypeFromFileExtensions with an unhandled file extension: " + ext);
            return "";
        }
    }

    /**
     * @private
     * Does as needed loading and simple dependecy management when loading modes
     * @param {string} mimetype  A mimetype that matches one of the available modes
     */
    function _loadModeForMimeType( mimetype ) {
        switch( mimetype ) {
        case "text/javascript":
        case "application/json":
            require("thirdparty/CodeMirror2/mode/javascript/javascript");
            break;

        case "text/css":
            require("thirdparty/CodeMirror2/mode/css/css");
            break;

        case "text/less":
            require("thirdparty/CodeMirror2/mode/less/less");

        case "text/html":
            _loadModeForMimeType("application/xml");
            _loadModeForMimeType("text/javascript");
            _loadModeForMimeType("text/css");
            require("thirdparty/CodeMirror2/mode/htmlmixed/htmlmixed");
            break;

        case "application/xml":
            require("thirdparty/CodeMirror2/mode/xml/xml");
            break;

        default:
            console.log("Called EditorUtils.js _loadModeForMimeType with an unhandled mimetype: " + mimetype);
            break;
        }
    }

    // Define public API
    exports.setModeFromFileExtension = setModeFromFileExtension;
    exports.setModeFromFileMimetype = setModeFromFileMimetype;
});