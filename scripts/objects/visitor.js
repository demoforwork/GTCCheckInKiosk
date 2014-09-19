/**
 * A Visitor object is any person registered for the conference.
 * @returns {Visitor}
 */
function Visitor() {
    //Protected this scope
    var self = this;
    /** Visitor id
     * @type Integer
     */
    this.id = 0;
    /**
     * Visitor Name
     * @type String
     */
    this.Name = '';
    /**
     * Visitor Email
     * @type String
     */
    this.Email = '';

    this.Location = '';
    this.Company = '';
    /**
     * Visitor checked in
     * @type Boolean
     */
    this.Checked = false;
    /**
     * Id of the picture
     * @type String
     */
    this.picture = '';
    /**
     * Retrieves a search result jQuery div for use in the product lookup 
     * page.
     */
    this.getSearchResult = function() {
        settings.log("getSearchResult() enter");
        var div = null;
        if (!this.Checked) {
            settings.log("not checked in, showing the search result");
            $("#search-result .search-result .name").text(self.Name).attr("data-id", self.id);
            $("#search-result .search-result .email").text(self.Email);
        }
        settings.log("getSearchResult() exit");
    };
    /**
     * Presents a bigger window with the "badge", can show more user information than the getSearchResult div
     * @returns {jQuery} badge div
     */
    this.getBadge = function () {
        settings.log("getBadge() enter");
        var div = null;
        if (!this.Checked) {
            settings.log("not checked in, showing the badge");
            $("#badge .check-in-badge .name").text(self.Name);
            $("#badge .check-in-badge .email").text(self.Email);
            $("#badge .check-in-badge .company").text(self.Company);
            $("#badge .check-in-badge .location").text(self.Location);
        }
        settings.log("getBadge() exit");
    };
}
