// app/models/book.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our book model
var bookSchema = mongoose.Schema({
    nookrInfo:{
        date: { 
            type: 'Date', 
        },
        rating: {
            type: 'Number'
        },
        ratings: [
            {
                userID: 'String',
                rating: 'Number'
            }
        ]
    },
    googleInfo: {
        kind: {
            type: 'String'
        },
        id: {
            type: 'String'
        },
        etag: {
            type: 'String'
        },
        selfLink: {
            type: 'String'
        },
        volumeInfo: {
            title: {
                type: 'String'
            },
            authors: {
                type: [
                    'String'
                ]
            },
            publisher: {
                type: 'String'
            },
            publishedDate: {
                type: 'Date'
            },
            description: {
                type: 'String'
            },
            industryIdentifiers: {
                type: [
                    'Mixed'
                ]
            },
            readingModes: {
                text: {
                    type: 'Boolean'
                },
                image: {
                    type: 'Boolean'
                }
            },
            pageCount: {
                type: 'Number'
            },
            printType: {
                type: 'String'
            },
            categories: {
                type: [
                    'String'
                ]
            },
            maturityRating: {
                type: 'String'
            },
            allowAnonLogging: {
                type: 'Boolean'
            },
            contentVersion: {
                type: 'String'
            },
            panelizationSummary: {
                containsEpubBubbles: {
                    type: 'Boolean'
                },
                containsImageBubbles: {
                    type: 'Boolean'
                }
            },
            imageLinks: {
                smallThumbnail: {
                    type: 'String'
                },
                thumbnail: {
                    type: 'String'
                }
            },
            language: {
                type: 'String'
            },
            previewLink: {
                type: 'String'
            },
            infoLink: {
                type: 'String'
            },
            canonicalVolumeLink: {
                type: 'String'
            }
        },
        saleInfo: {
            country: {
                type: 'String'
            },
            saleability: {
                type: 'String'
            },
            isEbook: {
                type: 'Boolean'
            },
            listPrice: {
                amount: {
                    type: 'Number'
                },
                currencyCode: {
                    type: 'String'
                }
            },
            retailPrice: {
                amount: {
                    type: 'Number'
                },
                currencyCode: {
                    type: 'String'
                }
            },
            buyLink: {
                type: 'String'
            },
            offers: {
                type: [
                    'Mixed'
                ]
            }
        },
        accessInfo: {
            country: {
                type: 'String'
            },
            viewability: {
                type: 'String'
            },
            embeddable: {
                type: 'Boolean'
            },
            publicDomain: {
                type: 'Boolean'
            },
            textToSpeechPermission: {
                type: 'String'
            },
            epub: {
                isAvailable: {
                    type: 'Boolean'
                },
                acsTokenLink: {
                    type: 'String'
                }
            },
            pdf: {
                isAvailable: {
                    type: 'Boolean'
                },
                acsTokenLink: {
                    type: 'String'
                }
            },
            webReaderLink: {
                type: 'String'
            },
            accessViewStatus: {
                type: 'String'
            },
            quoteSharingAllowed: {
                type: 'Boolean'
            }
        },
        searchInfo: {
            textSnippet: {
                type: 'String'
            }
        }
    }
    
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Book', bookSchema);