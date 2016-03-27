function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("JSON_PARSING_ERROR", "Error parsing input JSON object. ");
define("NO_RECORD_PAYLOAD_PROVIDED", "No record payload provided.");
define("NO_RECORD_ID_PROVIDED", "No record ID provided.");
define("PAGE_NUMBER_INVALID", "Page number must be higher than 0");
define("NO_QUERY_STRING_PROVIDED", "No query string provided.");
