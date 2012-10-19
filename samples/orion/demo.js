{
    initGrid: function(jsStoreController, id) {
        this.id = id;
        this.jsStoreController = jsStoreController;
        var me = this;
        $('head').append(
        '<style>' +
        '#' + id + ' div.comment{border-left: 1px solid #FFF;}' +
        '#' + id + ' div.comment.selected{border-left: 1px solid #4D90F0;}' +
        '</style>'
        );

        $('#' + id + ' .x-panel-header').append('<div id="imagebar" style="font-size: 10px; font-weight: normal; float: right; margin: 0px 40px 0px 10px; display: inline-block;"><div style="display: inline-block;margin-right:5px;">' + t$.getIconHtml("balloon") + ' My Issue' +
        '</div><div style="display: inline-block;">' + t$.getIconHtml("balloon_white") + ' Following Issue</div><div id = "updates" class="ra-link" style="font-size: 11px; display: inline-block;margin-left:10px; margin-top:1px;">Updates</div><div id = "comments" class="ra-link" style="font-size: 11px; display: inline-block;margin-left:5px; margin-top:1px;"> Comments</div>');
        $("#imagebar img").css("float", "left");

        this.userid = t$.getNumber('session.userid');
        var comments = $('<div class="xc-comments"></div>');
        var content = $('<div id="commentContent" style="position:relative;" class="xc-comments-content"></div>');
        var more = $('<a style="float: right;font-weight: bold; margin: 20px; font-size:120%;" class="xc-commens-more" href="#">More &darr;</a>');
        comments.append(content).append(more);
        this.content = content;

        content.on("click", "div.comment",
        function() {
            if ($(this).hasClass('selected')) {
                return false;
            }
            $this = $(this);
            var index = $this.index();
            $this.parent().find('.selected').removeClass('selected');
            $this.addClass('selected');
            jsStoreController.setCurrentRow(index);
        });
        $('#' + id + ' .x-panel-body').append(comments);
        content.on("click", "a.tasklink",
        function() {
            t$.goToPage("$p$detailsoftask&_wcTasksV=[taskid_=_" + $(this).attr('taskid') + "]&frompage=newpage&retainStores=Y");
            return false;
        });

        $('#updates').click(function() {
            $('#commentContent').slideUp(1000,
            function() {

                var updates = {
                    commentvalue: 'no'
                };
                t$.invokeQuery('StreamDashboard', null, updates);
                return false;
            });
            $('#commentContent').slideDown(1000);
        });

        $('#comments').click(function() {
            $('#commentContent').slideUp(1000,
            function() {

                var comments = {
                    commentvalue: 'yes'
                };
                t$.invokeQuery('StreamDashboard', null, comments);
                return false;

            });
            $('#commentContent').slideDown(1000);
        });

        content.on("click", "a.unsubscribe",
        function() {
            var model = {
                taskid: parseFloat($(this).attr('taskid')),
                userid: t$.getNumber('session.userid')
            };
            var link = $(this);
            link.hide();
            t$.invokeDataSource('DummyTaskStream', model, {
                onSuccess: function(result) {
                    var tasks = $('#commentContent .t' + link.attr('taskid'));
                    // reduce the offset to reflect the removed rows.
                    var tasksArray = $.makeArray(tasks);
                    var len = tasksArray.length;
                    $.each(tasksArray,
                    function(index, task) {
                        var rownum = $(task).index() - index;
                        t$.clearRow('StreamDashBoard', 'newIssueBtn', rownum);
                        $(task).delay(300 * index).slideUp(400,
                        function() {
                            $(this).remove();
                            if (len == index + 1) {
                                // in last task
                                if (me.content.children('.selected').length == 0) {
                                    if (me.content.children().length > 0) {
                                        me.content.children().first().trigger('click');
                                    } else {
                                        // empty... hence refresh
                                        t$.setOffset('StreamDashBoard', 'newIssueBtn', 0);
                                        t$.invokeQuery('StreamDashBoard');
                                    }
                                } else {
                                    // need a way to update the status bar with the new record number
                                    }
                            }
                        });
                    });
                    var total = tasksArray.length;
                    var offset = t$.getOffset('StreamDashBoard', 'newIssueBtn');
                    var totalLength = t$.getTotalLength('StreamDashBoard', 'newIssueBtn');
                    t$.setOffset('StreamDashBoard', 'newIssueBtn', offset - total);
                    t$.setTotalLength('StreamDashBoard', 'newIssueBtn', totalLength - total);
                },
                onFailure: function(result) {
                    link.show();
                }
            });
            return false;
        });
        content.on("mouseenter", "div.comment",
        function() {
            $(this).addClass("hover");
        });

        content.on("mouseleave", "div.comment",
        function() {
            $(this).removeClass("hover");
        });

        more.bind('click',
        function() {
            jsStoreController.next();
            return false;
        });
    },
    formatRow: function(row, index) {
        return '<div id="_t' + index + '" class="comment t' + row.taskid + (index == 0 ? " selected": "") + '"><div class="icon">' + ((row.userid == this.userid) ? t$.getIconHtml("balloon") : t$.getIconHtml("balloon_white")) + '<br/>' +
        ((row.userid == this.userid) ? t$.getIconHtml("status") : t$.getIconHtml("status_offline")) +
        '</div><div class="content">' +
        '<div class="hover-icons" style="display: none; float: right;">' + ((row.userid != this.userid) ? ' <a href="#" title="Unsubscribe" taskid="' + row.taskid + '" class="unsubscribe">' + t$.getIconHtml("balloon_minus") + '</a>': '') + '</div>' +
        '<span class="user"><b>' + row.stringvalue + ' <a href="#" class="tasklink" taskid="' + row.taskid + '">' + row.taskname + '</a>.</b></span><span class="text">' + ((row.comments) ? row.comments: '') + '</span><div style="display: block; height:22px;" class="timestamp">by <b>' + row.username + '</b> ' + row.updatedate
        + '</div></div></div>';
    },
    storeDataChanged: function(result, offset, totallength) {
        this.storeAdd(result.data, 0, offset, totallength);
    },
    storeAdd: function(rows, index, offset, totallength) {
        var str = new Array();
        var len = rows.length;
        for (var i = 0; i < len; i++) {
            str.push(this.formatRow(rows[i], (i + offset)));
        }
        this.content.append(str.join(''));
        this.slowScrollTo('#' + this.id + ' .x-panel-body', '#_t' + offset);
    },
    storeClear: function() {
        this.content.empty();
    },
    slowScrollTo: function(parent, id) {
        $(parent).animate({
            scrollTop: $(id).position().top
        },
        'slow');
    }
}