function afterTaskSave(colleagueId, nextSequenceId, userList) {
    var anexos = JSON.parse(hAPI.getCardValue("anexos") || []);
    var attachments = hAPI.listAttachments();

    if (anexos.length != 0) {
    	for (var ia = 0; ia < anexos.length; ia++) {
            var anexado = false;
            var docAttachId = anexos[ia]['id'];

            for (var i = 0; i < attachments.size(); i++) {
                var attachment = attachments.get(i);

                if (attachment.getDocumentId() == docAttachId) {
                    anexado = true;
                    break;
                }
            }

            if (anexado == false) {
                hAPI.attachDocument(docAttachId);
            }
        }
    }
}

